import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTheme} from '@/app/components/theme-context';
import axiosConfig from '@/app/helper/axios-config';
import {useMutation, UseMutationResult, useQuery} from '@tanstack/react-query';
import {CHAT_API} from '@/app/constants/api-routes';
import CameraLaunch from '@/app/components/chat-messages/camera-launch';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLocalSearchParams} from 'expo-router';
import {
  addMessage,
  ChatMessageRootState,
  ChatMessageState,
  clearChatMessages,
  ParticipantDetails,
  setChatMessages,
  setConversationSid,
  setStaffMembers,
  StaffMemberState,
} from '@/app/store/chat-messages-slice';
import {RootState} from '@/app/store/global-slice';
import {getMessageFormat} from '@/app/utils/helper-functions';
import {sendMediaMessage, sendMessage} from '@/app/helper/twillio-listners';
import {useQueryClient} from '@tanstack/react-query';
import RenderMessage from '@/app/components/chat-messages/render-message';
import ChatInput from '@/app/components/chat-messages/chat-input';
import ImageViewerModal from '@/app/components/chat-messages/image-viewer-modal';
import VideoViewerModal from '@/app/components/chat-messages/video-viewer-modal';
import ChatHeader from '@/app/components/chat-messages/chat-header';
import showToast from '@/app/components/toast';
import {translate} from '@/app/utils/i18n';
import {APIAxiosError} from '@/app/constants';
import {pickImage, pickVideos} from '@/app/helper/media-picker';
import {styled} from 'nativewind';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {navigateTo} from '@/app/helper/navigation';
import UserTypeModal from '@/app/components/chat-messages/user-type-modal';
import StaffListModal from '@/app/components/chat-messages/staff-list-modal';
import {ConversationRecord} from '@/app/store/create-group-slice';
import CustomChatModal from '@/app/components/create-group/new-chat-group-modal';

type ChatListParamList = {
  name: string;
  id: string;
  important?: string;
};

type MarkAsImportantRequest = {
  important: boolean;
  conversationSid: string;
};

type MarkAsImportantResponse = {
  message: string;
};

const NavigateStates = {
  view_contact_info: NAVIGATION_ROUTES.USER_PROFILE,
  group_info: NAVIGATION_ROUTES.GROUP_INFO,
  remove_user: NAVIGATION_ROUTES.GROUP_INFO,
};

const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);

export default function ChatMessagesScreen() {
  const {activeTheme} = useTheme();
  const {id, name, important} = useLocalSearchParams<ChatListParamList>();
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.global);
  const {
    conversationWithMessages: chatMessagesData,
    conversationType,
    staffMembers,
    isOwner,
  } = useSelector((state: ChatMessageRootState) => state.chatMessages);

  const isFocused = useIsFocused();

  const [FileMsg, setFileMsg] = useState<boolean | string>(false);
  const [textMsg, settextMsg] = useState('');
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string>('');
  const [isImageSelected, setIsImageSelected] = useState<boolean>(true);
  const [isChatImportant, setIsChatImportant] = useState<boolean>(
    important === 'true',
  );
  const [isUserTypeModalVisible, setIsUserTypeModalVisible] = useState(false);
  const [isStaffListModalVisible, setIsStaffListModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      dispatch(setConversationSid(id));
    }
  }, [dispatch, isFocused, id]);

  useEffect(() => {
    return () => {
      dispatch(clearChatMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (textMsg.length <= 0) {
      setFileMsg(false);
    }
  }, [textMsg]);

  const sendMsg = () => {
    if (textMsg.length > 0) {
      sendTextMsg();
      settextMsg('');
    }
  };

  const sendFileMsgs = async (image: ImagePicker.ImagePickerAsset) => {
    if (image) {
      const message = getMessageFormat(chatMessagesData, user, image, name);
      if (message) {
        dispatch(addMessage(message));
      }
      await sendMediaMessage(id, image);
      queryClient.invalidateQueries({queryKey: ['aboutMe']});
      queryClient.invalidateQueries({queryKey: ['chats']});
    }
  };

  const sendTextMsg = async () => {
    await sendMessage(id, textMsg);
    Keyboard.dismiss();
    queryClient.invalidateQueries({queryKey: ['aboutMe']});
    queryClient.invalidateQueries({queryKey: ['chats']});
  };

  const updateTyping = async (text: string) => {
    if (text.length > 0) {
      settextMsg(text);
    } else {
      settextMsg(text);
    }
  };

  const getChatMessages = useCallback(async (conversationId: string) => {
    const {data} = await axiosConfig.get(
      `${CHAT_API.GET_CHAT_MESSAGES}${conversationId}`,
    );
    return data;
  }, []);

  const {data: chatMessages, isLoading: isChatMessagesLoading} =
    useQuery<ChatMessageState>({
      enabled: !!id,
      queryKey: ['chatMessages', id],
      queryFn: ({queryKey}) => getChatMessages(queryKey[1] as string),
    });

  useEffect(() => {
    if (chatMessages) {
      dispatch(setChatMessages(chatMessages as ChatMessageState));
    }
  }, [chatMessages, dispatch]);

  const getStaffMembers = async (conversationId: string) => {
    const {data} = await axiosConfig.get<StaffMemberState>(
      `${CHAT_API.GET_STAFF_MEMBERS}${conversationId}`,
    );
    return data;
  };

  const {data: staffData, isLoading: isDataLoading} =
    useQuery<StaffMemberState>({
      queryKey: ['staffMembers', id],
      queryFn: ({queryKey}) => getStaffMembers(queryKey?.[1] as string),
    });

  useEffect(() => {
    if (staffData) {
      dispatch(setStaffMembers(staffData?.availableIdentities));
    }
  }, [staffData, dispatch]);

  const handleMediaPress = (imageUri: string, isImage: boolean) => {
    setSelectedMedia(imageUri);
    setIsImageSelected(isImage);
  };

  const closeImageViewer = () => {
    setSelectedMedia('');
  };

  const handleActions = (item: {value: string}) => {
    if (item?.value === 'camera') {
      setCameraModalVisible(true);
    } else if (item?.value === 'gallery') {
      pickImage({
        setModalVisible: setCameraModalVisible,
        handleReslut: sendFileMsgs,
      });
    } else {
      pickVideos({handleReslut: sendFileMsgs});
    }
  };

  const markAsImportant = async ({
    important,
    conversationSid,
  }: MarkAsImportantRequest): Promise<MarkAsImportantResponse> => {
    const {data} = await axiosConfig.put<MarkAsImportantResponse>(
      `${CHAT_API.MARK_AS_IMPORTANT}${conversationSid}`,
      {important},
    );

    return data;
  };

  const MarkAsImportantMutation: UseMutationResult<
    MarkAsImportantResponse,
    unknown,
    MarkAsImportantRequest
  > = useMutation({
    mutationFn: markAsImportant,
    onSuccess: (
      _data: MarkAsImportantResponse,
      requestData: MarkAsImportantRequest,
    ) => {
      setIsChatImportant(!isChatImportant);
      showToast(
        translate(
          requestData?.important
            ? 'mark_as_important_success'
            : 'mark_as_unimportant_success',
        ),
      );

      queryClient.invalidateQueries({queryKey: ['aboutMe']});
      queryClient.invalidateQueries({queryKey: ['chats']});
    },
    onError: (error: APIAxiosError, requestData: MarkAsImportantRequest) => {
      console.warn('Error: ', JSON.stringify(error?.response?.data, null, 2));
      showToast(
        error?.response?.data?.message ||
          translate(
            requestData?.important
              ? 'mark_as_important_failure'
              : 'mark_as_unimportant_failure',
          ),
      );
    },
  });

  const handlePopUpMenu = (value: string) => {
    if (['mark_as_important', 'mark_as_unimportant'].includes(value)) {
      MarkAsImportantMutation.mutate({
        important: value === 'mark_as_important',
        conversationSid: id,
      });
    } else if (value in NavigateStates) {
      navigateTo(NavigateStates[value as keyof typeof NavigateStates], {
        conversationSid: id,
        isOwner: JSON.stringify({isOwner}),
      });
    } else if (value === 'add_user') {
      setIsUserTypeModalVisible(true);
    } else {
      console.warn(`Unhandled menu option: ${value}`);
    }
  };

  const handleUserTypeSelection = (userType: 'customers' | 'staff') => {
    setIsUserTypeModalVisible(false);
    if (userType === 'staff') {
      setIsStaffListModalVisible(true);
    } else {
      setChatModalVisible(true);
    }
    // Handle 'customers' case if needed
  };

  const addToGroup = async ({
    phoneNumber,
    identities,
    conversationSid,
  }: {
    phoneNumber?: string;
    identities?: string[];
    conversationSid: string;
  }): Promise<ParticipantDetails> => {
    const body = {phoneNumber, identities};
    const url = phoneNumber
      ? CHAT_API.ADD_CUSTOMER_TO_GROUP
      : CHAT_API.ADD_STAFF_TO_GROUP;
    const {data} = await axiosConfig.post<ParticipantDetails>(
      `${url}${conversationSid}`,
      body,
    );

    return data;
  };

  const AddToGroupMutation: UseMutationResult<
    ParticipantDetails,
    unknown,
    {
      phoneNumber?: string;
      identities?: string[];
      conversationSid: string;
    }
  > = useMutation({
    mutationFn: addToGroup,
    onSuccess: (data: ParticipantDetails) => {
      setChatModalVisible(false);
      setIsStaffListModalVisible(false);
      showToast('Added to group successfully');
      queryClient.invalidateQueries({
        queryKey: ['groupInfo', {conversationSid: id}],
      });
      queryClient.invalidateQueries({
        queryKey: ['staffMembers', id],
      });
    },
    onError: (error: APIAxiosError) => {
      console.warn('Error: ', JSON.stringify(error?.response?.data, null, 2));
      showToast(
        error?.response?.data?.message ||
          translate('mark_as_important_failure'),
      );
    },
  });

  const handleAddToCustomer = (selectedStaff: ConversationRecord) => {
    AddToGroupMutation.mutate({
      phoneNumber: selectedStaff?.conversationFriendlyName,
      conversationSid: id,
    });
  };

  const handleAddToStaff = (selectedStaff: string[]) => {
    AddToGroupMutation.mutate({
      identities: selectedStaff,
      conversationSid: id,
    });
  };

  const unreadConversation = async ({
    unread,
    conversationSid,
  }: {
    unread: boolean;
    conversationSid: string;
  }): Promise<void> => {
    await axiosConfig.put(`${CHAT_API.MARK_AS_UNREAD}${conversationSid}`, {
      unread,
    });
  };

  const UnreadConversationMutation: UseMutationResult<
    void,
    unknown,
    {unread: boolean; conversationSid: string}
  > = useMutation({
    mutationFn: unreadConversation,
    onSuccess: () => {},
    onError: (error: APIAxiosError) => {
      console.warn('Error: ', JSON.stringify(error?.response?.data, null, 2));
    },
  });

  useEffect(() => {
    return () => {
      UnreadConversationMutation.mutate({unread: false, conversationSid: id});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView className="h-full">
      <StyledKeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{height: '100%', width: '100%'}}
        className={'w-full'}>
        <View className="h-[6%]">
          <ChatHeader
            name={name}
            handleActions={handlePopUpMenu}
            important={isChatImportant}
            conversationType={conversationType}
            isOwner={isOwner}
          />
        </View>
        {chatMessagesData?.length > 0 ? (
          <View className="flex-col-reverse p-2.5 h-[85%]">
            <View className="h-full">
              <FlatList
                showsVerticalScrollIndicator={false}
                inverted
                data={chatMessagesData}
                keyExtractor={(item, index) => `${item.date}-${index}`}
                renderItem={({item, index}) => (
                  <View key={`outer-${index}`}>
                    <View className="justify-center items-center m-5">
                      <Text className="text-black bg-white px-2.5 py-1.5 text-xs rounded-xl">
                        {item.date}
                      </Text>
                    </View>
                    <FlatList
                      nestedScrollEnabled={true}
                      data={item?.messages}
                      keyExtractor={(messages, msgIndex) =>
                        `${messages.messageSid}-${msgIndex}`
                      }
                      renderItem={({item, index}) => (
                        <RenderMessage
                          item={item}
                          index={index}
                          username={user?.userName ?? ''}
                          onMediaPress={handleMediaPress}
                        />
                      )}
                    />
                  </View>
                )}
              />
            </View>
          </View>
        ) : chatMessagesData.length === 0 && !isChatMessagesLoading ? (
          <View className="flex-col-reverse p-2.5 h-[85%] justify-center items-center">
            <Text>No messages</Text>
          </View>
        ) : (
          <View className="flex-col-reverse p-2.5 h-[85%] justify-center items-center">
            <ActivityIndicator size="large" color={activeTheme.linkContainer} />
          </View>
        )}
        <Modal
          visible={cameraModalVisible}
          onRequestClose={() => setCameraModalVisible(false)}>
          <SafeAreaView className="h-full w-full">
            <CameraLaunch
              setVisible={setCameraModalVisible}
              onHandleGallery={pickImage}
              getCameraImage={async (photo: any, filename: string) => {
                const image = {
                  ...photo,
                  fileName: filename,
                  mimeType: `image/${photo?.uri?.split('.').pop().split(/\#|\?/)?.[0]}`,
                };
                await sendFileMsgs(image);
              }}
            />
          </SafeAreaView>
        </Modal>
        {isImageSelected ? (
          <ImageViewerModal
            isVisible={!!selectedMedia}
            imageUri={selectedMedia}
            onClose={closeImageViewer}
          />
        ) : (
          <VideoViewerModal
            isVisible={!!selectedMedia}
            videoUri={selectedMedia}
            onClose={closeImageViewer}
          />
        )}
        <View className="h-[9%]">
          <ChatInput
            handleActions={handleActions}
            sendMsg={sendMsg}
            updateTyping={updateTyping}
            textMsg={textMsg}
            FileMsg={FileMsg}
          />
        </View>
        <UserTypeModal
          isVisible={isUserTypeModalVisible}
          onClose={() => setIsUserTypeModalVisible(false)}
          onSelectUserType={handleUserTypeSelection}
        />
        <StaffListModal
          isVisible={isStaffListModalVisible}
          staffMembers={staffMembers}
          isDataLoading={isDataLoading}
          loading={AddToGroupMutation?.isPending}
          onClose={() => setIsStaffListModalVisible(false)}
          onSelectStaff={handleAddToStaff}
        />
        <CustomChatModal
          visible={chatModalVisible}
          onClose={() => setChatModalVisible(false)}
          onSubmit={handleAddToCustomer}
          loading={AddToGroupMutation?.isPending}
        />
      </StyledKeyboardAwareScrollView>
    </SafeAreaView>
  );
}
