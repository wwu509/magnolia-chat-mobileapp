import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Control, FieldErrors} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import forgotPasswordStyles from '@/app/styles/forgot-password-style';
import CustomFormField from '@/app/components/custom-form-field';
import CustomButton from '@/app/components/custom-button';
import globalStyle from '@/app/styles/global-style';
import {useMutation, UseMutationResult} from '@tanstack/react-query';
import axiosConfig from '@/app/helper/axios-config';
import {navigateBack, navigateTo} from '@/app/helper/navigation';
import {AUTH_API} from '@/app/constants/api-routes';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {TEST_IDS} from '@/app/constants/test-ids/forgot-password-screen';
import {LOGIN_TYPES} from '@/app/constants';
import BackSvg from '@/assets/svgs/arrow-left-svg';
import EmailSvg from '@/assets/svgs/sms-svg';
import showToast from '@/app/components/toast';
import AppCustomLogo from '@/app/components/app-custom-logo';

type ForgotPasswordFormData = {
  email: string;
};

type ForgotPasswordResponse = {
  message: string;
};

const schema = yup.object().shape({
  email: yup.string().email('invalid_email').required('email_required'),
});

type ForgotPasswordAxiosError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const ForgotPassword: React.FC = () => {
  const {
    watch,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const email = watch('email');

  const sendResetLink = useCallback(
    async ({
      email,
    }: ForgotPasswordFormData): Promise<ForgotPasswordResponse> => {
      const {data} = await axiosConfig.post<ForgotPasswordResponse>(
        AUTH_API.FORGOT_PASSWORD,
        {
          email,
        },
      );

      return data;
    },
    [],
  );

  const ForgotPasswordMutation: UseMutationResult<
    ForgotPasswordResponse,
    unknown,
    ForgotPasswordFormData
  > = useMutation({
    mutationFn: sendResetLink,
    onSuccess: (res, formData) => {
      navigateTo(NAVIGATION_ROUTES.OTP, {
        email: formData?.email,
        type: LOGIN_TYPES.FORGOT_PASSWORD_EMAIL_OTP,
      });
    },
    onError: (error: ForgotPasswordAxiosError) => {
      console.warn('error: ', JSON.stringify(error?.response?.data, null, 2));
      showToast(error?.response?.data?.message as string);
    },
  });

  const onSubmit = useCallback(
    (formData: ForgotPasswordFormData) => {
      ForgotPasswordMutation.mutate(formData);
    },
    [ForgotPasswordMutation],
  );

  return (
    <SafeAreaView className={forgotPasswordStyles.container}>
      <Pressable
        testID={TEST_IDS.BUTTON.BACK_ICON}
        accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
        onPress={navigateBack}
        className="w-[100%] h-[3%]">
        <BackSvg />
      </Pressable>
      <View className={globalStyle.responsiveStyle}>
        <AppCustomLogo
          text={'magnolia_jewellers_forgot_password'}
          testID={TEST_IDS.TEXT.FORGOT_PASSWORD}
        />
        <CustomFormField
          control={control as unknown as Control}
          name="email"
          label={'email'}
          placeholder={'enter_your_email'}
          inputMode="email"
          errors={errors as FieldErrors}
          autoCapitalize="none"
          customIcon={EmailSvg}
          labelID={TEST_IDS.TEXT.ENTER_YOUR_EMAIL}
          errorID={TEST_IDS.ERROR.ENTER_YOUR_EMAIL}
          inputID={TEST_IDS.ERROR.ENTER_YOUR_EMAIL}
        />
        <CustomButton
          title={'send_otp'}
          onPress={handleSubmit(onSubmit)}
          disabled={!email}
          loading={ForgotPasswordMutation?.isPending}
          testID={TEST_IDS.BUTTON.SEND_OTP}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
