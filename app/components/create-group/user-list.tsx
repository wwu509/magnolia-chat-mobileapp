import React from 'react';
import {FlatList, ActivityIndicator, View, Text} from 'react-native';
import {useTheme} from '@/app/components/theme-context';
import UserCard from './user-card';
import {ConversationRecord} from '@/app/store/create-group-slice';

type UserListProps = {
  users: ConversationRecord[];
  onUserSelect: (user: ConversationRecord) => void;
  selectedUsers: ConversationRecord[];
  isLoading: boolean;
  activeTab: 'customers' | 'staff';
};

const UserList = ({
  users,
  selectedUsers,
  onUserSelect,
  isLoading,
  activeTab,
}: UserListProps) => {
  const {activeTheme} = useTheme();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={activeTheme.primaryColor} />
      </View>
    );
  }

  if (users?.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No users available</Text>
      </View>
    );
  }

  return (
    <FlatList
      className=""
      data={users}
      keyExtractor={item => item.participantSid}
      renderItem={({item}) => (
        <UserCard
          user={item}
          selectedUsers={selectedUsers}
          activeTab={activeTab}
          onSelect={() => onUserSelect(item)}
        />
      )}
    />
  );
};

export default UserList;
