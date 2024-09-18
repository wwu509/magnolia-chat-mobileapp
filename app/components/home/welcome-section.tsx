import React from 'react';
import {View, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {globalSelector} from '@/app/store/global-selector';
import homeScreenStyles from '@/app/styles/home-style';
import {useTheme} from '../theme-context';
import CustomText from '../custom-text';
import {TEST_IDS} from '@/app/constants/test-ids/home-screen';

type UserDetail = {
  imageUrl?: string;
};

type User = {
  userDetail?: UserDetail;
  email?: string;
  name?: string;
};

const WelcomeSection: React.FC = () => {
  const {user} = useSelector(globalSelector) as {user: User};
  const {activeTheme} = useTheme();

  return (
    <View className={homeScreenStyles.userView}>
      <Image
        source={{
          uri: user?.userDetail?.imageUrl
            ? user?.userDetail?.imageUrl
            : 'https://www.ateamsoftsolutions.com/wp-content/uploads/2020/09/user-dummy.jpg',
        }}
        className={homeScreenStyles.userImg}
        testID={TEST_IDS.IMAGE.LOGIN_USER_PROFILE_PICTURE}
        accessibilityLabel={TEST_IDS.IMAGE.LOGIN_USER_PROFILE_PICTURE}
      />
      <CustomText
        title={'hello_good_morning'}
        classname={`${homeScreenStyles.userName} ${activeTheme.buttonText}`}
        testID={TEST_IDS.TEXT.HELLO_GOOD_MORNING}
      />
      <CustomText
        title={user?.name || 'Test user'}
        classname={`${homeScreenStyles.secondaryText} ${activeTheme.buttonText}`}
        testID={TEST_IDS.TEXT.LOGIN_USER_NAME}
      />
    </View>
  );
};

export default WelcomeSection;
