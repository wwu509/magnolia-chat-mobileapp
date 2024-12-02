import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import * as yup from 'yup';
import {useForm, Control} from 'react-hook-form';

import {useTheme} from '@/app/components/theme-context';
import UserDefault from '@/assets/images/user_default.jpg';
import HomeUser from '@/assets/images/home_logo.png';
import CustomCheckbox from '../custom-checkbox';
import {TEST_IDS} from '@/app/constants/test-ids/create-group-screen';
import {yupResolver} from '@hookform/resolvers/yup';
import {ConversationRecord} from '@/app/store/create-group-slice';

type FormDataProps = {
  userSelection?: boolean;
};

type UserCardProps = {
  user: ConversationRecord;
  selectedUsers: ConversationRecord[];
  activeTab: 'customers' | 'staff';
  onSelect: () => void;
};

const schema = yup.object().shape({
  userSelection: yup.boolean(),
});

const UserCard = ({
  user,
  selectedUsers,
  activeTab,
  onSelect,
}: UserCardProps) => {
  const {activeTheme} = useTheme();

  const conversationUserName = `${user?.firstName} ${user?.lastName}`;

  const {watch, control, setValue} = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  const userSelection = watch('userSelection');

  const onSelection = (value?: boolean) => {
    onSelect();
  };

  useEffect(() => {
    const isSelected =
      !!selectedUsers?.find(
        item => item?.participantSid === user?.participantSid,
      ) || false;
    setValue('userSelection', isSelected);
  }, [selectedUsers, setValue, user?.participantSid]);

  return (
    <TouchableOpacity
      onPress={() => {
        onSelect();
        setValue('userSelection', !userSelection);
      }}>
      <View
        className={`flex-row items-center p-4 border-b ${activeTheme.inputBorder}`}>
        <Image
          source={activeTab === 'customers' ? UserDefault : HomeUser}
          className="w-[40] h-[40] rounded-full mr-4"
        />
        <Text className={`flex-1 ${activeTheme.text}`}>
          {user?.firstName
            ? conversationUserName
            : user.conversationFriendlyName}
        </Text>
        <View
          className={`w-6 h-6 rounded-full ${activeTheme.primaryColor} justify-center items-center`}>
          <CustomCheckbox
            control={control as unknown as Control}
            name="userSelection"
            onSelection={onSelection}
            labelID={TEST_IDS.TEXT.SELECTION_CHECBOX}
            errorID={TEST_IDS.ERROR.SELECTION_CHECBOX}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
