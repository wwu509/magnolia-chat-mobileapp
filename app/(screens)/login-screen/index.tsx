import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
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
import {styled} from 'nativewind';
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from '@/app/index';

type FormDataProps = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  id?: string;
  options?: {
    is2FAEnabled: boolean;
  };
  type?: string;
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

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token?: string) => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
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
    async ({email, password}: FormDataProps): Promise<AuthResponse> => {
      const {data} = await axiosConfig.post<AuthResponse>(AUTH_API.LOGIN, {
        email,
        password,
        notificationToken: expoPushToken,
      });
      return data;
    },
    [expoPushToken],
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
      UserLogin.mutate(formData);
    },
    [UserLogin],
  );

  const onRegisterPressHandle = () => {
    navigateTo(NAVIGATION_ROUTES.REGISTER);
  };

  return (
    <SafeAreaView className={loginScreenStyles.container}>
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
