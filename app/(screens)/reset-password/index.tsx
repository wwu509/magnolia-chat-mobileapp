import React from 'react';
import {Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Control, FieldErrors} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import resetPasswordStyles from '@/app/styles/reset-password-style';
import CustomFormField from '@/app/components/custom-form-field';
import CustomButton from '@/app/components/custom-button';
import globalStyle from '@/app/styles/global-style';
import {useMutation, UseMutationResult} from '@tanstack/react-query';
import axiosConfig from '@/app/helper/axios-config';
import {useLocalSearchParams} from 'expo-router';
import showToast from '@/app/components/toast';
import {navigateBack, navigateTo} from '@/app/helper/navigation';
import {useTheme} from '@/app/components/theme-context';
import {AUTH_API} from '@/app/constants/api-routes';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import CustomText from '@/app/components/custom-text';
import {TEST_IDS} from '@/app/constants/test-ids/reset-password-screen';
import BackSvg from '@/assets/svgs/arrow-left-svg';
import LockSvg from '@/assets/svgs/password-lock-svg';
import AppCustomLogo from '@/app/components/app-custom-logo';
import {APIAxiosError, LOGIN_TYPES} from '@/app/constants';
import {translate} from '@/app/utils/i18n';

type ResetPasswordFormData = {
  oldPassword?: string;
  newPassword: string;
  retypePassword: string;
};

type ResetPasswordResponse = {
  message: string;
};

const ForgotPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, 'password_min_length')
    .required('new_password_required'),
  retypePassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'passwords_must_match')
    .required('confirm_password_required'),
});

const ChangePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(6, 'password_min_length')
    .required('new_password_required'),
  newPassword: yup
    .string()
    .min(6, 'password_min_length')
    .required('new_password_required'),
  retypePassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'passwords_must_match')
    .required('confirm_password_required'),
});

const ResetPasswordScreen: React.FC = () => {
  const {email, otp, type} = useLocalSearchParams<{
    email: string;
    otp: string;
    type: string;
  }>();
  const {activeTheme} = useTheme();

  const {
    watch,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(
      type === LOGIN_TYPES.LOGIN_MOBILE_OTP
        ? ChangePasswordSchema
        : ForgotPasswordSchema,
    ),
  });

  const oldPassword = watch('oldPassword');
  const newPassword = watch('newPassword');
  const retypePassword = watch('retypePassword');

  const resetPassword = async ({
    newPassword,
    oldPassword,
  }: ResetPasswordFormData): Promise<ResetPasswordResponse> => {
    const body =
      type === LOGIN_TYPES.LOGIN_MOBILE_OTP
        ? {
            oldPassword,
            newPassword,
          }
        : {
            email,
            password: newPassword,
            otp,
          };
    const endPointUrl =
      type === LOGIN_TYPES.LOGIN_MOBILE_OTP
        ? AUTH_API.CHANGE_PASSWORD
        : AUTH_API.RESET_PASSWORD;
    const {data} = await axiosConfig.post<ResetPasswordResponse>(
      endPointUrl,
      body,
    );

    return data;
  };

  const ResetPasswordMutation: UseMutationResult<
    ResetPasswordResponse,
    unknown,
    ResetPasswordFormData
  > = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      if (type === LOGIN_TYPES.LOGIN_MOBILE_OTP) {
        navigateBack();
        showToast(translate('password_reset_success'));
      } else {
        navigateTo(NAVIGATION_ROUTES.PASSWORD_UPDATED);
      }
    },
    onError: (error: APIAxiosError) => {
      console.warn('Error: ', JSON.stringify(error?.response?.data, null, 2));
      showToast(
        error?.response?.data?.message || translate('password_reset_failure'),
      );
    },
  });

  const onSubmit = (formData: ResetPasswordFormData) => {
    ResetPasswordMutation.mutate(formData);
  };

  return (
    <SafeAreaView className={resetPasswordStyles.container}>
      <Pressable
        testID={TEST_IDS.BUTTON.BACK_ICON}
        accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
        onPress={navigateBack}
        className="w-[100%] h-[3%]">
        <BackSvg />
      </Pressable>
      <View className={globalStyle.responsiveStyle}>
        <AppCustomLogo
          text={'magnolia_jewellers_reset_password'}
          testID={TEST_IDS.TEXT.CREATE_NEW_PASSWORD}
        />
        <CustomText
          title={
            type === LOGIN_TYPES.LOGIN_MOBILE_OTP
              ? 'old_new_password_hint'
              : 'new_password_hint'
          }
          classname={`${resetPasswordStyles.description} ${activeTheme.label}`}
          testID={TEST_IDS.TEXT.NEW_PASSWORD_HINT}
        />
        {type === LOGIN_TYPES.LOGIN_MOBILE_OTP && (
          <CustomFormField
            control={control as unknown as Control}
            name="oldPassword"
            label={'old_password'}
            placeholder={'input_password'}
            secureTextEntry
            errors={errors as FieldErrors}
            customIcon={LockSvg}
            labelID={TEST_IDS.TEXT.ENTER_YOUR_NEW_PASSWORD}
            errorID={TEST_IDS.ERROR.ENTER_YOUR_NEW_PASSWORD}
            inputID={TEST_IDS.INPUT.ENTER_YOUR_NEW_PASSWORD}
          />
        )}
        <CustomFormField
          control={control as unknown as Control}
          name="newPassword"
          label={'new_password'}
          placeholder={'input_password'}
          secureTextEntry
          errors={errors as FieldErrors}
          customIcon={LockSvg}
          labelID={TEST_IDS.TEXT.ENTER_YOUR_NEW_PASSWORD}
          errorID={TEST_IDS.ERROR.ENTER_YOUR_NEW_PASSWORD}
          inputID={TEST_IDS.INPUT.ENTER_YOUR_NEW_PASSWORD}
        />
        <CustomFormField
          control={control as unknown as Control}
          name="retypePassword"
          label={'retype_password'}
          placeholder={'retype_password'}
          secureTextEntry
          errors={errors as FieldErrors}
          customIcon={LockSvg}
          labelID={TEST_IDS.TEXT.CONFIRM_NEW_PASSWORD}
          errorID={TEST_IDS.ERROR.CONFIRM_NEW_PASSWORD}
          inputID={TEST_IDS.INPUT.CONFIRM_NEW_PASSWORD}
        />
        <CustomButton
          title={'confirm'}
          onPress={handleSubmit(onSubmit)}
          disabled={!oldPassword || !newPassword || !retypePassword}
          loading={ResetPasswordMutation?.isPending}
          testID={TEST_IDS.BUTTON.RESET_PASSWORD}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
