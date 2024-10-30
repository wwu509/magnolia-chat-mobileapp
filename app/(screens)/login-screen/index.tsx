import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {Href, Link} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Control} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {loginScreenStyles} from '@/app/styles/login-screen-style';
import CustomCheckbox from '@/app/components/custom-checkbox';
import CustomButton from '@/app/components/custom-button';
import CustomFormField from '@/app/components/custom-form-field';
import globalStyle from '@/app/styles/global-style';
import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {
  getConfidentialData,
  setConfidentialData,
} from '@/app/utils/secure-storage';
import {useTheme} from '@/app/components/theme-context';
import {navigateTo, replaceRoute} from '@/app/helper/navigation';
import axiosConfig from '@/app/helper/axios-config';
import {setAccessToken} from '@/app/utils/access-token-data';
import {AUTH_API} from '@/app/constants/api-routes';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import CustomText from '@/app/components/custom-text';
import Translate from '@/app/components/translate';
import i18n from '@/app/utils/i18n';
import {TEST_IDS} from '@/app/constants/test-ids/login-screen';
import {APIAxiosError, LOGIN_TYPES} from '@/app/constants';
import EmailSvg from '@/assets/svgs/sms-svg';
import LockSvg from '@/assets/svgs/password-lock-svg';
import showToast from '@/app/components/toast';
import AppCustomLogo from '@/app/components/app-custom-logo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import messaging from '@react-native-firebase/messaging';
import {styled} from 'nativewind';

type FormDataProps = {
  email: string;
  password: string;
  rememberMe?: boolean;
  fcmToken?: string | null;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  id?: string;
  options?: {
    is2FAEnabled: boolean;
  };
  type?: string;
  fcmToken: string;
};

const schema = yup.object().shape({
  email: yup.string().email('invalid_email').required('email_required'),
  password: yup
    .string()
    .min(4, 'password_min_length')
    .required('password_required'),
  rememberMe: yup.boolean(),
});

const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);

const Login: React.FC = () => {
  const {activeTheme} = useTheme();
  const ns = i18n.language;

  const [fcmToken, setFcmToken] = useState<string | undefined>('');

  const getFcmPushToken = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const fcmToken = await messaging().getToken();
      setFcmToken(fcmToken);
    } else {
      console.log('Authorization status:', authStatus);
    }
  };

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        await getFcmPushToken();
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };

    fetchFcmToken();
  }, []);

  const {
    watch,
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  const email = watch('email');
  const password = watch('password');

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedEmail = await getConfidentialData('email');
        const storedPassword = await getConfidentialData('password');
        const rememberMe = (await getConfidentialData('rememberMe')) === 'true';

        if (rememberMe) {
          if (storedEmail) setValue('email', storedEmail);
          if (storedPassword) setValue('password', storedPassword);
          setValue('rememberMe', rememberMe);
        }
      } catch (error) {
        console.warn(JSON.stringify(error, null, 2));
      }
    };

    (async () => await loadStoredData())();
  }, [setValue]);

  const authenticateUser = useCallback(
    async ({
      email,
      password,
      fcmToken,
    }: FormDataProps & {fcmToken: string}): Promise<AuthResponse> => {
      const {data} = await axiosConfig.post<AuthResponse>(AUTH_API.LOGIN, {
        email,
        password,
        fcmToken,
      });
      return data;
    },
    [],
  );

  const UserLogin: UseMutationResult<AuthResponse, unknown, FormDataProps> =
    useMutation({
      mutationFn: authenticateUser,
      onSuccess: async (data, formData) => {
        await loginSuccess(data, formData);
      },
      onError: (error: APIAxiosError) => {
        showToast(error?.response?.data?.message || error?.message || '');
      },
    });

  const onSubmit = useCallback(
    (formData: FormDataProps) => {
      UserLogin.mutate({...formData, fcmToken: fcmToken});
    },
    [UserLogin],
  );

  const onRegisterPressHandle = () => {
    navigateTo(NAVIGATION_ROUTES.REGISTER);
  };

  return (
    <SafeAreaView className={loginScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <StyledKeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{height: '100%'}}
        className={'w-full'}
        enableOnAndroid>
        <View className={globalStyle.responsiveStyle}>
          <AppCustomLogo
            text={'magnolia_jewellers_login'}
            testID={TEST_IDS.TEXT.WELCOME_BACK}
          />
          <CustomFormField
            control={control as unknown as Control}
            name="email"
            label="email"
            placeholder="enter_your_email"
            inputMode="email"
            errors={errors}
            autoCapitalize="none"
            customIcon={EmailSvg}
            labelID={TEST_IDS.TEXT.ENTER_YOUR_EMAIL}
            errorID={TEST_IDS.ERROR.ENTER_YOUR_EMAIL}
            inputID={TEST_IDS.INPUT.ENTER_YOUR_EMAIL}
          />
          <CustomFormField
            control={control as unknown as Control}
            name="password"
            label="password"
            placeholder="enter_your_password"
            secureTextEntry
            errors={errors}
            autoCapitalize="none"
            customIcon={LockSvg}
            labelID={TEST_IDS.TEXT.ENTER_YOUR_PASSWORD}
            errorID={TEST_IDS.ERROR.ENTER_YOUR_PASSWORD}
            inputID={TEST_IDS.INPUT.ENTER_YOUR_PASSWORD}
          />
          <View className={'w-full flex-row justify-between items-center mt-5'}>
            <CustomCheckbox
              control={control as unknown as Control}
              name="rememberMe"
              label="remember_me"
              labelID={TEST_IDS.TEXT.REMEMBER_ME}
              errorID={TEST_IDS.ERROR.REMEMBER_ME}
            />
            <View className={loginScreenStyles.forgotPassword}>
              <Link
                testID={TEST_IDS.TEXT.FORGOT_PASSWORD}
                accessibilityLabel={TEST_IDS.TEXT.FORGOT_PASSWORD}
                href={
                  NAVIGATION_ROUTES.FORGOT_PASSWORD as Href<string | object>
                }
                className={`text-sm font-medium ${activeTheme.linkContainer}`}>
                <Translate value={'forgot_password'} ns={ns} />
              </Link>
            </View>
          </View>
          <CustomButton
            title={'login'}
            onPress={handleSubmit(onSubmit)}
            disabled={!email || !password}
            loading={UserLogin?.isPending}
            testID={TEST_IDS.BUTTON.LOGIN}
          />
          <View className="h-[25%] w-full flex-row items-center justify-center mt-4">
            <CustomText
              title={'want_to_create_an_account'}
              classname={`text-sm ${activeTheme.checkboxText}`}
              testID={TEST_IDS.TEXT.WANT_TO_CREATE_ACCOUNT}
            />
            <CustomText
              title={'signup'}
              onPress={onRegisterPressHandle}
              classname={`font-medium ${activeTheme.linkContainer}`}
              testID={TEST_IDS.TEXT.SIGN_UP}
            />
          </View>
        </View>
      </StyledKeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Login;

export const loginSuccess = async (
  data: AuthResponse,
  formData?: FormDataProps,
) => {
  const tokenData = {
    access_token: data?.access_token,
    refresh_token: data?.refresh_token,
    userId: data?.id,
    is2FAEnabled: data?.options?.is2FAEnabled,
  };

  if (formData?.rememberMe) {
    await setConfidentialData('email', formData.email);
    await setConfidentialData('password', formData.password);
    await setConfidentialData('rememberMe', 'true');
  } else {
    await setConfidentialData('email', '');
    await setConfidentialData('password', '');
    await setConfidentialData('rememberMe', 'false');
  }

  if (data?.options?.is2FAEnabled) {
    navigateTo(NAVIGATION_ROUTES.OTP, {
      email: formData?.email || '',
      type: LOGIN_TYPES.LOGIN_MOBILE_OTP,
    });
  } else {
    await setAccessToken(tokenData);
    replaceRoute(NAVIGATION_ROUTES.HOME as Href<string | object>);
  }
};
