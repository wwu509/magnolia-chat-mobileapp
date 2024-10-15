import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';

import {useTheme} from '@/app/components/theme-context';
import {navigateBack} from '@/app/helper/navigation';

import CustomChatModal from '@/app/components/create-group/new-chat-group-modal';
import BackIcon from '@/assets/svgs/arrow-left-svg';
import UserPlus from '@/assets/svgs/user-plus-svg';
import {ConversationRecord} from '@/app/store/create-group-slice';

type HeaderProps = {
  groupName: string;
  addToCustomersList: (user: ConversationRecord) => void;
};

const Header: React.FC<HeaderProps> = ({groupName, addToCustomersList}) => {
  const {activeTheme} = useTheme();
  const [chatModalVisible, setChatModalVisible] = useState(false);

  return (
    <View className="flex-row items-center py-3">
      <Pressable
        onPress={navigateBack}
        className="w-[10%] items-center jusify-center">
        <BackIcon width={24} height={24} viewBox="0 0 24 24" />
      </Pressable>
      <Text className={`w-[80%] text-center ${activeTheme.text}`}>
        {groupName}
      </Text>
      <Pressable
        onPress={() => setChatModalVisible(true)}
        className="w-[10%] items-center">
        <UserPlus fill={activeTheme.primaryColor} width={20} height={20} />
      </Pressable>
      <CustomChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        onSubmit={(user: ConversationRecord) => {
          setChatModalVisible(false);
          addToCustomersList(user);
        }}
      />
    </View>
  );
};

export default Header;
