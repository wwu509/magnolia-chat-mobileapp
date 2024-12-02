import React from 'react';
import {View, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/app/store/global-slice';
import homeScreenStyles from '@/app/styles/home-style';
import {useTheme} from '../theme-context';
import CustomText from '../custom-text';
import {TEST_IDS} from '@/app/constants/test-ids/home-screen';
import HomeLogo from '@/assets/images/home_logo.png';

const WelcomeSection: React.FC = () => {
  const {user} = useSelector((state: RootState) => state.global);
  const {activeTheme} = useTheme();

  return (
    <View className={homeScreenStyles.userView}>
      <Image
        source={HomeLogo}
        className={homeScreenStyles.userImg}
        testID={TEST_IDS.IMAGE.LOGIN_USER_PROFILE_PICTURE}
        accessibilityLabel={TEST_IDS.IMAGE.LOGIN_USER_PROFILE_PICTURE}
      />
      <CustomText
        title={'hello_good_morning'}
        classname={`${homeScreenStyles.userName} ${activeTheme.buttonText}`}
        testID={TEST_IDS.TEXT.HELLO_GOOD_MORNING}
      />
      {user?.name && (
        <CustomText
          title={user?.name}
          classname={`${homeScreenStyles.secondaryText} ${activeTheme.buttonText}`}
          testID={TEST_IDS.TEXT.LOGIN_USER_NAME}
        />
      )}
    </View>
  );
};

export default WelcomeSection;
