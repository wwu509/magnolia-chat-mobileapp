import React, {useCallback, useEffect} from 'react';
import {View, Image, Pressable, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import {TEST_IDS} from '@/app/constants/test-ids/user-profile';
import {navigateBack} from '@/app/helper/navigation';

import UserDefault from '@/assets/images/user_default.jpg';
import CustomText from '@/app/components/custom-text';
import BackSvg from '@/assets/svgs/arrow-left-svg';
import axiosConfig from '@/app/helper/axios-config';
import {CHAT_API} from '@/app/constants/api-routes';
import {useQuery} from '@tanstack/react-query';
import {
  setUserInfo,
  UserInfo,
  UserInfoState,
} from '@/app/store/user-profile-slice';
import {useLocalSearchParams} from 'expo-router';
import {useTheme} from '@/app/components/theme-context';

const ProfileScreen = () => {
  const {activeTheme} = useTheme();

  const {userInfo} = useSelector(
    (state: {userInfo: UserInfoState}) => state.userInfo,
  );

  const {conversationSid} = useLocalSearchParams<{conversationSid: string}>();

  const dispatch = useDispatch();

  const getChatInfo = useCallback(async (conversationSid: string) => {
    const {data} = await axiosConfig.get(
      `${CHAT_API.CHAT_INFO}${conversationSid}`,
    );
    return data;
  }, []);

  const {data: chatInfo, isPending: isChatInfoPending} = useQuery<UserInfo>({
    queryKey: ['chatInfo', conversationSid],
    queryFn: ({queryKey}) => getChatInfo(queryKey?.[1] as string),
  });

  useEffect(() => {
    if (chatInfo) {
      dispatch(setUserInfo(chatInfo));
    }
  }, [chatInfo, dispatch]);

  return (
    <SafeAreaView className="flex-1 p-5">
      <Pressable
        testID={TEST_IDS.BUTTON.BACK_ICON}
        accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
        onPress={navigateBack}
        className="w-[100%] h-[3%]">
        <BackSvg />
      </Pressable>
      {isChatInfoPending ? (
        <View className=" p-2.5 h-full justify-center items-center">
          <ActivityIndicator size="large" color={activeTheme.linkContainer} />
        </View>
      ) : (
        <View className="items-center pt-12">
          <Image
            source={UserDefault}
            className="w-[100px] h-[100px] rounded-full mb-5"
            testID={TEST_IDS.IMAGE.USER_PROFILE_PICTURE}
            accessibilityLabel={TEST_IDS.IMAGE.USER_PROFILE_PICTURE}
          />
          <CustomText
            classname="text-2xl font-bold mb-1"
            title={userInfo?.conversation?.friendlyName}
            testID={TEST_IDS.TEXT.USER_NAME}
          />
          <CustomText
            classname="text-lg text-gray-600"
            title={userInfo?.conversation?.uniqueName?.split('-')[1] || ''}
            testID={TEST_IDS.TEXT.USER_FRIENDLY_NAME}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
