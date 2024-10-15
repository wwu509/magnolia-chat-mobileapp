import React from 'react';
import {View, Image} from 'react-native';
import forgotPasswordStyles from '@/app/styles/forgot-password-style';
import LoginLogo from '@/assets/images/login_logo.png';
import {useTheme} from '@/app/components/theme-context';
import {TEST_IDS} from '@/app/constants/test-ids/global';
import CustomText from '@/app/components/custom-text';

type AppCustomLogoProps = {
  text: string;
  testID: string;
};

const AppCustomLogo: React.FC<AppCustomLogoProps> = ({text, testID}) => {
  const {activeTheme} = useTheme();
  return (
    <View className={'flex justify-center items-center my-8'}>
      <Image
        source={LoginLogo}
        className={'w-[150px] h-[150px] rounded-full'}
        testID={TEST_IDS.IMAGE.LOGO}
        accessibilityLabel={TEST_IDS.IMAGE.LOGO}
      />
      <CustomText
        title={text}
        classname={`${forgotPasswordStyles.logoText} ${activeTheme.text}`}
        testID={testID}
      />
    </View>
  );
};

export default AppCustomLogo;
