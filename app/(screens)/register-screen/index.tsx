import React, {useCallback} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Control} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {loginScreenStyles} from '@/app/styles/login-screen-style';
import CustomButton from '@/app/components/custom-button';
import CustomFormField from '@/app/components/custom-form-field';
import globalStyle from '@/app/styles/global-style';
import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {navigateBack} from '@/app/helper/navigation';
import axiosConfig from '@/app/helper/axios-config';
import {AUTH_API} from '@/app/constants/api-routes';
import {TEST_IDS} from '@/app/constants/test-ids/login-screen';
import {APIAxiosError} from '@/app/constants';
import EmailSvg from '@/assets/svgs/sms-svg';
import LockSvg from '@/assets/svgs/password-lock-svg';
import UserNameSvg from '@/assets/svgs/user-svg';
import showToast from '@/app/components/toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import KeyboardAvoidingView from '@/app/components/keyboard-avoiding-view';
import {styled} from 'nativewind';
import BackButtonWithTitle from '@/app/components/header/back-button';
import forgotPasswordStyles from '@/app/styles/forgot-password-style';
import CustomText from '@/app/components/custom-text';
import {useTheme} from '@/app/components/theme-context';

type FormDataProps = {
  name: string;
  userName: string;
  email: string;
  password: string;
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
  name: yup.string().required('name_required'),
  userName: yup.string().required('username_required'),
  email: yup.string().email('invalid_email').required('email_required'),
  password: yup
    .string()
    .min(4, 'password_min_length')
    .required('password_required'),
});

const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);

const Register: React.FC = () => {
  const {
    watch,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  const name = watch('name');
  const userName = watch('userName');
  const email = watch('email');
  const password = watch('password');
  const {activeTheme} = useTheme();

  const authenticateUser = useCallback(
    async ({
      email,
      password,
      name,
      userName,
    }: FormDataProps): Promise<AuthResponse> => {
      const {data} = await axiosConfig.post<AuthResponse>(AUTH_API.REGISTER, {
        name,
        userName,
        email,
        password,
        role: 'super_admin',
      });
      return data;
    },
    [],
  );

  const UserLogin: UseMutationResult<AuthResponse, unknown, FormDataProps> =
    useMutation({
      mutationFn: authenticateUser,
      onSuccess: async () => {
        navigateBack();
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

  return (
    <StyledKeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{height: '100%'}}
      className={'w-full bg-white'}>
      <KeyboardAvoidingView>
        <SafeAreaView className={loginScreenStyles.container}>
          <BackButtonWithTitle title="Register" />
          <CustomText
            title="magnolia_jewellers_register"
            classname={`${forgotPasswordStyles.logoTextRegister} ${activeTheme.text}`}
            testID={TEST_IDS.TEXT.WELCOME_BACK}
          />
          <View className={globalStyle.responsiveStyle}>
            <CustomFormField
              name="name"
              label="Name"
              control={control as unknown as Control}
              placeholder="enter_your_name"
              errors={errors}
              autoCapitalize="none"
              customIcon={UserNameSvg}
              containerStyle={'mb-3'}
              labelID={TEST_IDS.TEXT.ENTER_YOUR_NAME}
              errorID={TEST_IDS.ERROR.ENTER_YOUR_NAME}
              inputID={TEST_IDS.INPUT.ENTER_YOUR_NAME}
            />
            <CustomFormField
              control={control as unknown as Control}
              name="userName"
              label="UserName"
              placeholder="enter_your_username"
              errors={errors}
              autoCapitalize="none"
              customIcon={UserNameSvg}
              containerStyle={'mb-3'}
              labelID={TEST_IDS.TEXT.ENTER_YOUR_USERNAME}
              errorID={TEST_IDS.ERROR.ENTER_YOUR_USERNAME}
              inputID={TEST_IDS.INPUT.ENTER_YOUR_USERNAME}
            />
            <CustomFormField
              control={control as unknown as Control}
              name="email"
              label="Email"
              placeholder="enter_your_email"
              inputMode="email"
              errors={errors}
              autoCapitalize="none"
              customIcon={EmailSvg}
              containerStyle={'mb-3'}
              labelID={TEST_IDS.TEXT.ENTER_YOUR_EMAIL}
              errorID={TEST_IDS.ERROR.ENTER_YOUR_EMAIL}
              inputID={TEST_IDS.INPUT.ENTER_YOUR_EMAIL}
            />
            <CustomFormField
              control={control as unknown as Control}
              name="password"
              label="Password"
              placeholder="enter_your_password"
              secureTextEntry
              errors={errors}
              autoCapitalize="none"
              customIcon={LockSvg}
              containerStyle={'mb-3'}
              labelID={TEST_IDS.TEXT.ENTER_YOUR_PASSWORD}
              errorID={TEST_IDS.ERROR.ENTER_YOUR_PASSWORD}
              inputID={TEST_IDS.INPUT.ENTER_YOUR_PASSWORD}
            />
            <CustomButton
              title={'register'}
              onPress={handleSubmit(onSubmit)}
              disabled={!name || !userName || !email || !password}
              loading={UserLogin?.isPending}
              testID={TEST_IDS.BUTTON.LOGIN}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </StyledKeyboardAwareScrollView>
  );
};

export default Register;
