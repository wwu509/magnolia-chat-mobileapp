import React, {useCallback} from 'react';
import {View, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomText from '@/app/components/custom-text';
import CustomButton from '@/app/components/custom-button';
import BackSvg from '@/assets/svgs/arrow-left-svg';
import VerificationMethod from '@/app/components/forgot-password/verification-method';
import {navigateBack, navigateTo} from '@/app/helper/navigation';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {TEST_IDS} from '@/app/constants/test-ids/forgot-password-options-screen';
import {verificationMethods} from '@/app/constants';

const ForgotPassword: React.FC = () => {
  const [verificationMethod, setVerificationMethod] =
    React.useState<string>('');

  const handleNavigation = useCallback(
    () => navigateTo(NAVIGATION_ROUTES.FORGOT_PASSWORD),
    [],
  );

  const handleCardOnPress = useCallback((type: string) => {
    setVerificationMethod(type);
  }, []);

  return (
    <SafeAreaView className="h-full w-full items-center pb-2 bg-white">
      <Pressable
        testID={TEST_IDS.BUTTON.BACK_ICON}
        accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
        onPress={navigateBack}
        className="w-[90%] h-[8%]">
        <BackSvg />
      </Pressable>
      <View className="w-[90%] h-[84%]">
        <View className="w-full">
          <CustomText
            title="forgot_password_with_lock"
            classname="self-start text-xl font-bold text-center text-neutral-950"
            testID={TEST_IDS.TEXT.FORGOT_PASSWORD_WITH_LOCK}
          />
          <CustomText
            title="keep_calm_recover_password"
            classname="mt-2 text-sm leading-5 text-zinc-600"
            testID={TEST_IDS.TEXT.KEEP_CALM_RECOVER_PASSWORD}
          />
        </View>
        <View className="flex flex-col mt-6 ">
          {verificationMethods?.map((method, index) => (
            <VerificationMethod
              key={index}
              type={method?.type}
              icon={method?.icon}
              selected={verificationMethod === method?.type}
              onPress={() => handleCardOnPress(method?.type)}
            />
          ))}
        </View>
      </View>
      <View className="w-[100%] h-[8%]">
        <CustomButton
          title="confirm"
          onPress={handleNavigation}
          disabled={!verificationMethod}
          buttonStyle="w-[90%] rounded-lg p-3 self-center items-center"
          testID={TEST_IDS.BUTTON.CONFIRM}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
