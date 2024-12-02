import {View, TextInput, Pressable, Keyboard} from 'react-native';
import React, {useState, useRef, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLocalSearchParams} from 'expo-router';
import {useMutation, UseMutationResult} from '@tanstack/react-query';
import axiosConfig from '@/app/helper/axios-config';
import useResendOtpMutation from '@/app/components/resend-otp-mutation';
import otpScreenStyles from '@/app/styles/otp-style';
import CustomButton from '@/app/components/custom-button';
import {useTheme} from '@/app/components/theme-context';
import CustomText from '@/app/components/custom-text';
import showToast from '@/app/components/toast';
import {AUTH_API} from '@/app/constants/api-routes';
import {loginSuccess} from '@/app/(screens)/login-screen';
import {navigateBack, navigateTo} from '@/app/helper/navigation';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {TEST_IDS} from '@/app/constants/test-ids/otp-screen';
import {LOGIN_TYPES} from '@/app/constants';
import BackSvg from '@/assets/svgs/arrow-left-svg';
import AppCustomLogo from '@/app/components/app-custom-logo';

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  id: string;
  type?: string;
};

type OTPScreenAxiosError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const OTPScreen: React.FC = () => {
  const {email, type} = useLocalSearchParams<{email: string; type: string}>();
  const {activeTheme} = useTheme();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [otpError, setOTPError] = useState<string>('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      if (text.length <= 1) {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index === otp.length - 1) {
          Keyboard.dismiss();
        } else if (text && index < otp.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
      setOTPError('');
    },
    [otp],
  );

  const handleKeyPress = useCallback(
    (index: number) => {
      if (index > 0 && otp[index] === '') {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const authenticateUser = useCallback(
    async (otp: string): Promise<AuthResponse> => {
      const {data} = await axiosConfig.post<AuthResponse>(
        `${AUTH_API.OTP_VERIFICATION}${type}`,
        {
          email,
          otp,
          tenantId: 0,
        },
      );
      return data;
    },
    [email, type],
  );

  const userLoginSuccess = useCallback(
    async (data: AuthResponse) => {
      if (type === LOGIN_TYPES.FORGOT_PASSWORD_EMAIL_OTP) {
        navigateTo(NAVIGATION_ROUTES.RESET_PASSWORD, {
          email,
          otp: otp.join(''),
        });
      } else {
        await loginSuccess(data, {email, password: ''});
      }
    },
    [email, otp, type],
  );

  const UserLoginWithOTP: UseMutationResult<AuthResponse, unknown, string> =
    useMutation({
      mutationFn: authenticateUser,
      onSuccess: userLoginSuccess,
      onError: (error: OTPScreenAxiosError) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'failed_to_login_with_otp_please_try_again';
        setOTPError(errorMessage);
        showToast(errorMessage);
      },
    });

  const handleVerify = useCallback(() => {
    UserLoginWithOTP.mutate(otp.join(''));
  }, [UserLoginWithOTP, otp]);

  const ResendOtpMutation = useResendOtpMutation(email, type);

  const handleResendOtp = useCallback(() => {
    ResendOtpMutation.mutate();
  }, [ResendOtpMutation]);

  const emailAddress = email?.substring(7);

  return (
    <SafeAreaView
      className={`${otpScreenStyles.container} ${activeTheme.background}`}>
      <Pressable
        testID={TEST_IDS.BUTTON.BACK_ICON}
        accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
        onPress={navigateBack}
        className="w-[100%] h-[3%]">
        <BackSvg />
      </Pressable>
      <View className="w-full h-[60%] flex-col justify-between">
        <View className={`${otpScreenStyles.childContainer} mt-[40]`}>
          <AppCustomLogo
            text={'magnolia_jewellers_email_verification'}
            testID={TEST_IDS.TEXT.ACCOUNT_VERIFICATION}
          />
          <CustomText
            title={'sent_verification_code'}
            classname={`${otpScreenStyles.subtitle} ${activeTheme.checkboxText}`}
            dynamicValue={{emailAddress}}
            testID={TEST_IDS.TEXT.SEND_VERIFICATION_CODE}
          />
          <View className={otpScreenStyles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                testID={`${TEST_IDS.INPUT.ENTER_YOUR_OTP}_${index}`}
                accessibilityLabel={`${TEST_IDS.INPUT.ENTER_YOUR_OTP}_${index}`}
                key={index}
                placeholderTextColor={'gray'}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={() => handleKeyPress(index)}
                keyboardType="numeric"
                maxLength={1}
                ref={ref => (inputRefs.current[index] = ref)}
                className={`${otpScreenStyles.otpInput} ${otpError ? activeTheme.otpErrorInputBorder : activeTheme.otpInput}`}
              />
            ))}
          </View>
          {otpError && (
            <CustomText
              testID={'errorID'}
              title={otpError?.toString() || ''}
              classname={`'mt-1' ${activeTheme.errorText}`}
            />
          )}
          <View className="flex-row mt-3">
            <CustomText
              title={'didnt_receive_code'}
              onPress={ResendOtpMutation.mutate}
              classname={`${otpScreenStyles.resend} ${activeTheme.checkboxText}`}
              testID={TEST_IDS.TEXT.DIDNT_RECEIVE_CODE}
            />
            <CustomText
              title={'resend'}
              classname={activeTheme.linkContainer}
              onPress={handleResendOtp}
              testID={TEST_IDS.TEXT.RESEND}
            />
          </View>
        </View>
        <View className="h-[20%] w-[94%] mx-auto">
          <CustomButton
            title={'confirm'}
            onPress={otp ? handleVerify : () => {}}
            disabled={otp?.join('')?.length < 4}
            loading={UserLoginWithOTP?.isPending}
            testID={TEST_IDS.BUTTON.CONTINUE}
            buttonStyle={
              'w-full h-[45] rounded-md items-center justify-center mt-1'
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
