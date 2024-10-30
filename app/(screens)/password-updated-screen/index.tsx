import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {TEST_IDS} from '@/app/constants/test-ids/password-updated-screen';
import {reset} from '@/app/helper/navigation';
import BackSvg from '@/assets/svgs/arrow-left-svg';
import CheckSvg from '@/assets/svgs/vibrant-check-green-svg';
import CustomButton from '@/app/components/custom-button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@/app/components/theme-context';
import otpScreenStyles from '@/app/styles/otp-style';
import CustomText from '@/app/components/custom-text';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {Href} from 'expo-router';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {styled} from 'nativewind';

const PasswordUpdatedScreen: React.FC = () => {
  const {activeTheme} = useTheme();
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);
  const navigateToLogin = useCallback(() => {
    reset(NAVIGATION_ROUTES.LOGIN_IN as Href<string | object>);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      navigateToLogin();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [navigateToLogin, timeLeft]);

  return (
    <SafeAreaView
      className={`w-full h-full p-4 items-center ${activeTheme.background}`}>
      <Pressable
        testID={TEST_IDS.BUTTON.BACK_ICON}
        accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
        onPress={navigateToLogin}
        className="w-[100%] h-[3%]">
        <BackSvg />
      </Pressable>
      <StyledKeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{height: '100%'}}
        className={'w-full'}
        enableOnAndroid>
        <View className="w-full h-[52%] flex-col justify-between mt-[20%]">
          <View className="flex flex-col items-center mt-6 w-full text-center">
            <CheckSvg />
            <CustomText
              title={'password_updated'}
              classname={`mt-7 text-xl font-bold ${activeTheme.checkboxText}`}
              testID={TEST_IDS.TEXT.PASSWORD_UPDATED}
            />
            <CustomText
              title={'password_update_success'}
              classname={`mt-2 text-sm leading-5 ${activeTheme.text}`}
              testID={TEST_IDS.TEXT.PASSWORD_UPDATED_SUCCESS}
            />
          </View>
        </View>
        <View className="w-full h-[28%] items-center mt-40">
          <CustomButton
            title={'back_to_sign_in'}
            onPress={navigateToLogin}
            testID={TEST_IDS.BUTTON.BACK_TO_SIGN_IN}
          />
          <View className="flex-row gap-1 items-start mt-3 text-zinc-600">
            <CustomText
              title={'redirecting_to_sign_in'}
              classname={`${otpScreenStyles.subtitle} ${activeTheme.checkboxText}`}
              dynamicValue={{timeLeft}}
              testID={TEST_IDS.TEXT.REDIRECTED_TO_SIGN_IN}
            />
          </View>
        </View>
      </StyledKeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PasswordUpdatedScreen;
