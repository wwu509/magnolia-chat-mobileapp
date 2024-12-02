import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Keyboard,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useMutation, UseMutationResult, useQuery} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {useQueryClient} from '@tanstack/react-query';
import showToast from '@/app/components/toast';
import axiosConfig from '@/app/helper/axios-config';
import {setUserData, User} from '@/app/store/global-slice';
import {useTheme} from '@/app/components/theme-context';
import {initializeTwilioClient} from '@/app/helper/twillio-listners';
import {Conversation} from '@/app/store/chat-listing-slice';
import {navigateTo} from '@/app/helper/navigation';
import {AUTH_API, CHAT_API} from '@/app/constants/api-routes';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import WelcomeSection from '@/app/components/home/welcome-section';
import CustomChatModal from '@/app/components/home/new-chat-modal';
import CustomGroupModal from '@/app/components/home/new-group-modal';
import MessageItem from '@/app/components/chat-listing/message-item';
import {FloatingButton} from '@/app/components/floating-action-button';
import {APIAxiosError} from '@/app/constants';
import {useFocusEffect} from 'expo-router';

type NewChatParams = {
  firstName: string;
  lastName: string;
  userName?: string;
  phone?: string;
  message?: string;
  media?: any;
};

const Home = () => {
  const dispatch = useDispatch();
  const {activeTheme} = useTheme();
  const queryClient = useQueryClient();
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  const getUserDetails = useCallback(async () => {
    const {data} = await axiosConfig.get(AUTH_API.ME);
    return data;
  }, []);

  useFocusEffect(() => {
    getUserDetails();
  });

  const getChatToken = useCallback(async () => {
    const {data} = await axiosConfig.get(CHAT_API.CHAT_TOKEN);
    return data;
  }, []);

  const {
    data: userData,
    isLoading: userDataLoading,
    refetch,
  } = useQuery<User>({
    queryKey: ['aboutMe'],
    queryFn: getUserDetails,
  });

  const {data: chatToken} = useQuery({
    queryKey: ['chat-token'],
    queryFn: getChatToken,
  });

  const newChat = useCallback(
    async (
      params: NewChatParams,
    ): Promise<{
      message: string;
      conversationSid: string;
      firstName: string;
      lastName: string;
    }> => {
      const formData = new FormData();
      formData.append('file', params?.media);
      formData.append('first_name', params?.firstName as string);
      formData.append(
        'friendlyName',
        `${params?.firstName} ${params?.lastName}` as string,
      );
      formData.append('last_name', params?.lastName as string);
      formData.append(
        'uniqueName',
        `${params?.userName}-${params?.phone}` as string,
      );
      formData.append('phoneNumber', params?.phone as string);
      formData.append('message', params?.message as string);

      const {data} = await axiosConfig.post<{
        message: string;
        conversationSid: string;
      }>(`${CHAT_API.CREATE_CHAT}`, formData, {
        headers: {
          Accept: '*/*',
          'Content-Type': 'multipart/form-data',
        },
      });
      const newData = {
        ...data,
        name: params?.firstName || '',
      };
      return newData;
    },
    [],
  );

  const newChatSuccess = useCallback(
    async (data: {message: string; conversationSid: string; name: string}) => {
      setChatModalVisible(false);
      navigateTo(NAVIGATION_ROUTES.CHAT_MESSAGES, {
        id: data?.conversationSid,
        name: data?.name,
      });
      queryClient.invalidateQueries({queryKey: ['aboutMe']});
      queryClient.invalidateQueries({queryKey: ['chats']});
    },
    [queryClient],
  );

  const NewChatAPIMutate: UseMutationResult<NewChatParams, APIAxiosError, any> =
    useMutation({
      mutationFn: newChat,
      onSuccess: newChatSuccess,
      onError: (error: APIAxiosError) => {
        const errorMessage =
          error?.response?.data?.message || error?.message || '';
        showToast(errorMessage);
      },
    });

  useEffect(() => {
    if (chatToken) {
      initializeTwilioClient(chatToken, dispatch, queryClient);
    }
  }, [chatToken, dispatch]);

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData));
    }
  }, [userData, dispatch]);

  const handleStartChat = () => {
    setChatModalVisible(true);
  };

  const handleStartGroup = () => {
    setGroupModalVisible(true);
  };

  const handleChatSubmit = useCallback(
    (
      firstName: string,
      lastName: string,
      phone: string,
      message: string,
      media: any,
    ) => {
      Keyboard.dismiss();
      NewChatAPIMutate.mutate({
        firstName,
        lastName,
        phone,
        message,
        media,
        userName: userData?.userName,
      });
    },
    [NewChatAPIMutate, userData?.userName],
  );

  const handleGroupSubmit = useCallback((name: string) => {
    navigateTo(NAVIGATION_ROUTES.CREATE_GROUP, {name});
    setGroupModalVisible(false);
  }, []);

  return (
    <SafeAreaView className={`flex-1  ${activeTheme.background}`}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View className="flex-1">
        <WelcomeSection />
        <View className="flex-row justify-between p-4  ">
          <View className="w-[47.5%] bg-blue-600 rounded-lg p-4 justify-center shadow-lg">
            <Text className="text-white text-sm text-center">Total Chats</Text>
            <Text className="text-white font-medium text-sm text-center">
              {userData?.conversations?.count || 0}
            </Text>
          </View>
          <View className="w-[47.5%] bg-green-600 rounded-lg p-4 justify-center shadow-lg">
            <Text className="text-white  text-sm text-center">Important</Text>
            <Text className="text-white font-bold text-sm text-center">
              {userData?.importantConversations || 0}
            </Text>
          </View>
        </View>
        <Text className="text-lg px-4 font-bold ">Recent Chats Listing</Text>
        {userDataLoading ? (
          <View className="flex-col-reverse p-2.5 h-[40%] justify-center items-center">
            <ActivityIndicator size="large" color={activeTheme.linkContainer} />
          </View>
        ) : (userData?.conversations?.records || [])?.length === 0 ? (
          <View className="flex-col-reverse p-2.5 h-[50%] justify-center items-center">
            <Text className="text-center text-base text-gray-600 w-2/3">
              You currently don't have any chats. Start a conversation now!
            </Text>
          </View>
        ) : (
          <FlatList
            data={userData?.conversations?.records || []}
            renderItem={({item}: {item: Conversation}) => (
              <MessageItem {...item} />
            )}
            keyExtractor={(_item: Conversation, index: number) =>
              index.toString()
            }
            contentContainerStyle={{paddingHorizontal: 20}}
            refreshControl={
              <RefreshControl size={1} onRefresh={refetch} refreshing={false} />
            }
          />
        )}
        <FloatingButton
          onPress={() => {}}
          onChatPress={handleStartChat}
          onGroupPress={handleStartGroup}
          style={{bottom: 20, right: 20}}
        />
      </View>

      <CustomChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        onSubmit={handleChatSubmit}
        loading={NewChatAPIMutate?.isPending}
      />

      <CustomGroupModal
        visible={groupModalVisible}
        onClose={() => setGroupModalVisible(false)}
        onSubmit={handleGroupSubmit}
        loading={NewChatAPIMutate?.isPending}
      />
    </SafeAreaView>
  );
};

export default Home;
