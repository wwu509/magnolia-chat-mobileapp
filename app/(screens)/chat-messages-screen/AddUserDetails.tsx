import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useForm, Control, FieldErrors} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomFormField from '@/app/components/custom-form-field';
import CustomButton from '@/app/components/custom-button';
import {TEST_IDS} from '@/app/constants/test-ids/home-screen';
import Icon from '@expo/vector-icons/Ionicons'; // Replace with your icon library
import showToast from '@/app/components/toast';
import {translate} from '@/app/utils/i18n';
import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {APIAxiosError} from '@/app/constants';
import {CHAT_API} from '@/app/constants/api-routes';
import axiosConfig from '@/app/helper/axios-config';
import {
  ChatMessageRootState,
  Message,
  setMutedUsers,
} from '@/app/store/chat-messages-slice';
import {useDispatch, useSelector} from 'react-redux';

// Define the schema using Yup
const schema = yup
  .object({
    firstName: yup.string().required('Enter your first name'),
    lastName: yup.string().required('Enter your last name'),
  })
  .required();

interface NewChatFormData {
  firstName: string;
  lastName: string;
}

type UpdateUserRequest = {
  first_name: string;
  last_name: string;
  customer_id?: string | null;
};

type UpdateUserResponse = {
  message: string;
};

type MuteUserRequest = {
  conversationSid: string;
  userId?: number;
  isMuted: boolean;
};

type MuteUserResponse = {
  message: string;
};

interface AddUserDetailsProps {
  modalVisible: boolean;
  onClose: () => void;
  item: Message; // Assuming 'any' is the intended type for 'item' based on the context
  refetchMethod: any;
  isUserMute: boolean;
}

const AddUserDetails: React.FC<AddUserDetailsProps> = ({
  modalVisible,
  onClose,
  item,
  refetchMethod,
  isUserMute,
}) => {
  const {mutedUsers} = useSelector(
    (state: ChatMessageRootState) => state.chatMessages,
  );

  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const dispatch = useDispatch();

  const isUpdateName =
    !!item?.smsClient && !item?.client?.firstName && !item?.client?.lastName;

  const {
    watch,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<NewChatFormData>({
    resolver: yupResolver(schema),
  });
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const updateUser = async ({
    first_name,
    last_name,
    customer_id,
  }: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const {data} = await axiosConfig.put<UpdateUserResponse>(
      `${CHAT_API.CHAT_USER_UPDATE}`,
      {first_name, last_name, customer_id},
    );

    return data;
  };

  const UpdateUserMutation: UseMutationResult<
    UpdateUserResponse,
    unknown,
    UpdateUserRequest
  > = useMutation({
    mutationFn: updateUser,
    onSuccess: (_data: UpdateUserResponse) => {
      showToast(translate('update_user_success'));

      refetchMethod();
    },
    onError: (error: APIAxiosError) => {
      console.warn('Error: ', JSON.stringify(error?.response?.data, null, 2));
      showToast(
        error?.response?.data?.message || translate('update_user_failure'),
      );
    },
  });

  const muteUser = async ({
    conversationSid,
    userId,
    isMuted,
  }: MuteUserRequest): Promise<MuteUserResponse> => {
    const {data} = await axiosConfig.post<MuteUserResponse>(
      `${CHAT_API.CHAT_MUTE_USER}`,
      {conversationSid, userId, isMuted},
    );

    return data;
  };

  const MuteUserMutation: UseMutationResult<
    MuteUserResponse,
    unknown,
    MuteUserRequest
  > = useMutation({
    mutationFn: muteUser,
    onSuccess: (
      _data: MuteUserResponse,
      {isMuted, userId}: MuteUserRequest,
    ) => {
      showToast(
        translate(isMuted ? 'user_muted_success' : 'user_unmuted_success'),
      );
      if (isMuted) {
        const newMutedUsers = [...mutedUsers, userId || 0];
        dispatch(setMutedUsers(newMutedUsers));
      } else {
        const newMutedUsers = mutedUsers?.filter(
          (value: number) => value !== userId,
        );
        dispatch(setMutedUsers(newMutedUsers));
      }

      refetchMethod();
    },
    onError: (error: APIAxiosError, {isMuted}: MuteUserRequest) => {
      console.warn('Error: ', JSON.stringify(error?.response?.data, null, 2));
      showToast(
        error?.response?.data?.message ||
          translate(isMuted ? 'user_muted_failure' : 'user_unmuted_failure'),
      );
    },
  });

  const handleFormSubmit = (data: NewChatFormData) => {
    UpdateUserMutation.mutate({
      first_name: data.firstName,
      last_name: data?.lastName,
      customer_id: item?.customer_id,
    });
    setShowUpdateForm(false);
    onClose(); // Close the modal after submitting
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.emptySpace}></Text>
            <Text style={styles.title}>
              {showUpdateForm ? 'Update User Name' : 'User Actions'}
            </Text>
            <Text
              onPress={() => {
                setShowUpdateForm(false);
                onClose();
              }}
              style={styles.closeIcon}>
              X
            </Text>
          </View>
          {!showUpdateForm && (
            <View style={styles.actionContainer}>
              {/* Update Username Button */}
              {isUpdateName && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowUpdateForm(true)}>
                  <Icon name="person" size={24} color="black" />
                  <Text style={styles.actionText}>Update Username</Text>
                </TouchableOpacity>
              )}
              {/* Mute/Unmute Toggle */}
              {item?.user?.role?.name === 'agent' && (
                <View>
                  <View className="h-[1px] bg-[#ccc]" />
                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>
                      {isUserMute ? 'Unmute User' : 'Mute User'}
                    </Text>
                    <Switch
                      value={isUserMute}
                      onValueChange={value => {
                        MuteUserMutation.mutate({
                          conversationSid: item?.conversationSid,
                          userId: item?.user?.id,
                          isMuted: value,
                        });
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          )}
          {/* Conditional Form Rendering */}
          {showUpdateForm && (
            <View style={styles.form}>
              <CustomFormField
                control={control as unknown as Control}
                containerStyle="mb-4 w-[100%]"
                inputStyle="text-base w-[88%]"
                name="firstName"
                placeholder={'enter_your_first_name'}
                errors={errors as FieldErrors}
                autoCapitalize="none"
                labelID={TEST_IDS.TEXT.ENTER_YOUR_NAME}
                errorID={TEST_IDS.ERROR.ENTER_YOUR_NAME}
                inputID={TEST_IDS.INPUT.ENTER_YOUR_NAME}
              />
              <CustomFormField
                control={control as unknown as Control}
                containerStyle="mb-4 w-[100%]"
                inputStyle="text-base w-[88%]"
                name="lastName"
                placeholder={'enter_your_last_name'}
                errors={errors as FieldErrors}
                autoCapitalize="none"
                labelID={TEST_IDS.TEXT.ENTER_YOUR_NAME}
                errorID={TEST_IDS.ERROR.ENTER_YOUR_NAME}
                inputID={TEST_IDS.INPUT.ENTER_YOUR_NAME}
              />
              <CustomButton
                title={'Submit'}
                onPress={handleSubmit(handleFormSubmit)}
                disabled={!firstName || !lastName} // Button is disabled if fields are empty
                testID={TEST_IDS.BUTTON.SUBMIT}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  emptySpace: {
    width: 24, // Adjust to balance alignment
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
  },
  form: {
    width: '100%',
  },
});

export default AddUserDetails;
