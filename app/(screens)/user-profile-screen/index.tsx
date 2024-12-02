import React, {useCallback, useEffect} from 'react';
import {
  View,
  Image,
  Pressable,
  ActivityIndicator,
  FlatList,
} from 'react-native';
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
import {FontAwesome6, MaterialCommunityIcons} from '@expo/vector-icons';

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

  const getChatInfoAgents = useCallback(async (conversationSid: string) => {
    const {data} = await axiosConfig.get(
      `${CHAT_API.CHAT_INFO_AGENTS}${conversationSid}`,
    );
    return data;
  }, []);

  const {data: chatInfoAgents, isPending: isChatInfoAgentsPending} =
    useQuery<UserInfo>({
      queryKey: ['chatInfoAgents', conversationSid],
      queryFn: ({queryKey}) => getChatInfoAgents(queryKey?.[1] as string),
    });

  useEffect(() => {
    if (chatInfo) {
      dispatch(setUserInfo(chatInfo));
    }
  }, [chatInfo, dispatch]);

  const renderUserItem = ({
    item,
  }: {
    item: {
      id: number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      role: string;
    };
  }) => (
    <View className="w-full flex-row items-center justify-between py-3 border-b border-gray-200">
      <View className="flex-row items-center">
        <Image source={UserDefault} className="w-10 h-10 rounded-full mr-3" />
        <CustomText
          title={`${item?.firstName} ${item?.lastName}` || item?.phoneNumber}
          classname="text-base"
        />
        {item?.role && (
          <View className="ml-4">
            <FontAwesome6
              name={item?.role === 'super_admin' ? 'user-shield' : 'user-tie'}
              size={18}
            />
          </View>
        )}
      </View>
      {chatInfoAgents?.mutedUsers?.includes(item?.id || 0) && (
        <View className="flex-row space-x-4 mr-4">
          <MaterialCommunityIcons name="message-off" size={20} />
          <CustomText classname="text-sm text-gray-500 ml-1" title="Muted" />
        </View>
      )}
    </View>
  );

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
            classname="text-2xl font-bold mb-1 text-black"
            title={userInfo?.conversation?.friendlyName}
            testID={TEST_IDS.TEXT.USER_NAME}
          />
          <CustomText
            classname="text-lg text-gray-600 text-black"
            title={userInfo?.conversation?.uniqueName?.split('+')?.[1] || ''}
            testID={TEST_IDS.TEXT.USER_FRIENDLY_NAME}
          />
        </View>
      )}
      {isChatInfoAgentsPending ? (
        <View className=" p-2.5 h-full justify-center items-center">
          <ActivityIndicator size="large" color={activeTheme.linkContainer} />
        </View>
      ) : (
        <View className="items-center pt-12">
          <FlatList
            data={chatInfoAgents?.users || []}
            renderItem={renderUserItem}
            keyExtractor={item => item?.id}
            className="h-full w-full"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
