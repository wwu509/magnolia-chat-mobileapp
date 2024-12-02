import React from 'react';
import {FlatList, View, Text, Image} from 'react-native';

import {useTheme} from '@/app/components/theme-context';

import UserDefault from '@/assets/images/user_default.jpg';
import HomeUser from '@/assets/images/home_logo.png';
import {ConversationRecord} from '@/app/store/create-group-slice';

type SelectedUsersListProps = {
  users: ConversationRecord[];
};

const SelectedUsersList = ({users}: SelectedUsersListProps) => {
  const {activeTheme} = useTheme();

  const renderItem = ({item: user}: {item: ConversationRecord}) => {
    const conversationUserName = `${user?.firstName} ${user?.lastName}`;
    return (
      <View key={user.participantSid} className="mr-2.5 items-center pl-2">
        <Image
          source={user?.conversationUserName ? HomeUser : UserDefault}
          className="w-[64] h-[64] rounded-full"
        />
        <Text className={`${activeTheme.text} mt-1.5`}>
          {user?.firstName
            ? conversationUserName
            : user.conversationFriendlyName}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.participantSid}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingStart: 5,
      }}
    />
  );
};

export default SelectedUsersList;
