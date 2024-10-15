import {Text, Alert, Pressable} from 'react-native';
import React from 'react';
import {useTheme} from '@/app/components/theme-context';
import styles from '@/app/styles/setting-style';
import CustomText from '@/app/components/custom-text';
import {TEST_IDS} from '@/app/constants/test-ids/setting-screen';
import {clearAccessToken} from '@/app/utils/access-token-data';
import {navigateTo, replaceRoute} from '@/app/helper/navigation';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Href} from 'expo-router';
import {useDispatch} from 'react-redux';
import {clearUserData} from '@/app/store/global-slice';
import {clearChatMessages} from '@/app/store/chat-messages-slice';
import {clearConversationList} from '@/app/store/chat-listing-slice';
import {useQueryClient} from '@tanstack/react-query';
import {LOGIN_TYPES} from '@/app/constants';

const Setting: React.FC = () => {
  const {activeTheme} = useTheme();

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  // Placeholder logout handler
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: async () => {
          dispatch(clearUserData());
          dispatch(clearChatMessages());
          dispatch(clearConversationList());
          queryClient.removeQueries();
          await clearAccessToken();
          replaceRoute(NAVIGATION_ROUTES.LOGIN_IN as Href<string | object>);
        },
      },
    ]);
  };

  // Placeholder change password handler
  const handleChangePassword = () => {
    navigateTo(NAVIGATION_ROUTES.RESET_PASSWORD, {
      type: LOGIN_TYPES.LOGIN_MOBILE_OTP,
    });
  };

  return (
    <SafeAreaView className={`${styles.container} ${activeTheme.background}`}>
      <Text className="text-lg pt-10 mb-5 text-center px-5 font-bold ">
        Settings
      </Text>
      <Pressable
        onPress={handleChangePassword}
        className="w-[90%] border-b border-gray-300 py-3.5 mx-auto">
        <CustomText
          title="change_password"
          classname={`${styles.text} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.SETTING}
        />
      </Pressable>
      <Pressable
        className="w-[90%] border-b border-gray-300 py-3.5 mx-auto"
        onPress={handleLogout}>
        <CustomText
          title="logout"
          classname={`${styles.text} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.SETTING}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default Setting;
