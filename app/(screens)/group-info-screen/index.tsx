import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Image,
  Pressable,
  FlatList,
  Text,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {useLocalSearchParams} from 'expo-router';

import {navigateBack} from '@/app/helper/navigation';
import {CHAT_API} from '@/app/constants/api-routes';
import {
  setGroupInfo,
  GroupInfoState,
  Participant,
  removeGroupMember,
} from '@/app/store/group-info-slice';
import {useTheme} from '@/app/components/theme-context';
import {APIAxiosError} from '@/app/constants';

import CustomText from '@/app/components/custom-text';
import GroupLogo from '@/assets/images/group_default.png';
import UserDefault from '@/assets/images/user_default.jpg';
import BackSvg from '@/assets/svgs/arrow-left-svg';
import showToast from '@/app/components/toast';
import axiosConfig from '@/app/helper/axios-config';

type RemoveUserParams = {
  userId: string;
  conversationSid: string;
};

const UserListScreen = () => {
  const {activeTheme} = useTheme();

  const {conversationSid, isOwner} = useLocalSearchParams<{
    conversationSid: string;
    isOwner: string;
  }>();

  const isAdmin: boolean = JSON.parse(isOwner)?.isOwner;

  const {groupInfo} = useSelector(
    (state: {groupInfo: GroupInfoState}) => state.groupInfo,
  );

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [userToRemove, setUserToRemove] = useState<{
    userName: string;
    name: string;
  } | null>(null);

  const getGroupInfo = useCallback(async (conversationSid: string) => {
    const {data} = await axiosConfig.get(
      `${CHAT_API.GROUP_INFO}${conversationSid}`,
    );

    return data;
  }, []);

  const {data: groupInfoData, isPending: isGroupInfoPending} = useQuery({
    queryKey: ['groupInfo', conversationSid],
    queryFn: ({queryKey}) => getGroupInfo(queryKey?.[1] as string),
  });

  useEffect(() => {
    if (groupInfoData) {
      dispatch(setGroupInfo(groupInfoData));
    }
  }, [groupInfoData, dispatch]);

  const removeUser = useCallback(
    async (params: RemoveUserParams): Promise<{message: string}> => {
      const {data} = await axiosConfig.delete<{
        message: string;
        conversationSid: string;
      }>(`${CHAT_API.REMOVE_USER}${params?.conversationSid}/${params?.userId}`);

      return data;
    },
    [],
  );

  const removeUserSuccess = useCallback(
    async (data: {message: string}, requestUser: RemoveUserParams) => {
      dispatch(removeGroupMember(requestUser?.userId));
      showToast(data?.message);
      queryClient.invalidateQueries({
        queryKey: ['staffMembers', requestUser?.conversationSid],
      });
    },
    [dispatch, queryClient],
  );

  const RemoveUserAPIMutate: UseMutationResult<
    {message: string},
    APIAxiosError,
    RemoveUserParams,
    unknown
  > = useMutation({
    mutationFn: removeUser,
    onSuccess: removeUserSuccess,
    onError: (error: APIAxiosError) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || '';
      console.warn('Error: from Rmove User API:: ', errorMessage);
      showToast(errorMessage);
    },
  });

  const handleRemoveUser = useCallback(
    (userId: string, conversationSid: string) => {
      RemoveUserAPIMutate.mutate({
        conversationSid,
        userId,
      });
    },
    [RemoveUserAPIMutate],
  );

  const showRemoveConfirmation = useCallback(
    (userName: string, name: string) => {
      setUserToRemove({userName, name});
      setIsRemoveModalVisible(true);
    },
    [],
  );

  const handleConfirmRemove = useCallback(() => {
    if (userToRemove) {
      handleRemoveUser(userToRemove?.userName, conversationSid);
      setIsRemoveModalVisible(false);
      setUserToRemove(null);
    }
  }, [userToRemove, handleRemoveUser, conversationSid]);

  const handleCancelRemove = useCallback(() => {
    setIsRemoveModalVisible(false);
    setUserToRemove(null);
  }, []);

  const renderUserItem = ({item}: {item: Participant}) => (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
      <View className="flex-row items-center">
        <Image source={UserDefault} className="w-10 h-10 rounded-full mr-3" />
        <CustomText
          title={item?.name || item?.phoneNumber}
          classname="text-lg"
        />
        {item?.isOwner && (
          <View className="ml-2 flex-row items-center">
            <MaterialCommunityIcons
              name="shield-check"
              size={20}
              color="green"
            />
            <CustomText classname="text-sm text-gray-500 ml-1" title="Admin" />
          </View>
        )}
      </View>
      {isAdmin && !item?.isOwner && item?.identity && (
        <View className="flex-row space-x-2">
          <Pressable
            className="bg-red-500 rounded-full p-2"
            onPress={() => {
              showRemoveConfirmation(item?.identity, item?.name);
              // handleRemoveUser(
              //   item?.identity || item.phoneNumber,
              //   conversationSid,
              // );
            }}>
            <MaterialCommunityIcons name="close" size={20} color="white" />
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderStaffHeaderComponent = () => {
    return (
      <View className="mb-2">
        <CustomText classname="text-xl font-semibold" title="Group Members" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-5">
        <Pressable
          onPress={navigateBack}
          className="w-full h-12 justify-center">
          <BackSvg />
        </Pressable>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          className="mb-5">
          {isGroupInfoPending ? (
            <View className=" p-2.5 h-full justify-center items-center">
              <ActivityIndicator
                size="large"
                color={activeTheme.linkContainer}
              />
            </View>
          ) : (
            <>
              <View className="items-center pt-6 mb-8">
                <Image
                  source={GroupLogo}
                  className="w-24 h-24 rounded-full mb-5"
                />
                <CustomText
                  classname="text-2xl font-bold mb-1"
                  title={groupInfo?.conversation.friendlyName}
                />
              </View>
              {RemoveUserAPIMutate?.isPending ? (
                <View className=" p-2.5 justify-center items-center">
                  <ActivityIndicator
                    size="large"
                    color={activeTheme.linkContainer}
                  />
                </View>
              ) : (groupInfo?.participants || [])?.length > 0 ? (
                <FlatList
                  data={groupInfo?.participants || []}
                  renderItem={renderUserItem}
                  ListHeaderComponent={renderStaffHeaderComponent}
                  keyExtractor={item => item.sid}
                  className="h-full"
                />
              ) : (
                <View className="h-[50%] justify-center items-center">
                  <Text className="text-base">No participant added</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
        <RemoveConfirmationModal
          isRemoveModalVisible={isRemoveModalVisible}
          userToRemove={userToRemove?.name || ''}
          handleCancelRemove={handleCancelRemove}
          handleConfirmRemove={handleConfirmRemove}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserListScreen;

const RemoveConfirmationModal = ({
  isRemoveModalVisible,
  userToRemove,
  handleCancelRemove,
  handleConfirmRemove,
}: {
  isRemoveModalVisible: boolean;
  userToRemove: string;
  handleCancelRemove: () => void;
  handleConfirmRemove: () => void;
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isRemoveModalVisible}
    onRequestClose={handleCancelRemove}>
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white p-5 rounded-lg w-4/5">
        <CustomText
          title="Confirm Removal"
          classname="text-lg font-bold mb-3"
        />
        <CustomText
          title={`Are you sure you want to remove ${userToRemove} from the group?`}
          classname="mb-4"
        />
        <View className="flex-row justify-end">
          <Pressable onPress={handleCancelRemove} className="mr-4 p-2">
            <Text className="text-blue-500">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleConfirmRemove}
            className="bg-red-500 p-2 rounded">
            <Text className="text-white">Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);
