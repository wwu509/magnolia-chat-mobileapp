import React, {useState} from 'react';
import {View, Pressable, SafeAreaView} from 'react-native';
import {useTheme} from '@/app/components/theme-context';
import CustomChatModal from '@/app/components/create-group/new-chat-group-modal';
import UserPlus from '@/assets/svgs/user-plus-svg';
import {ConversationRecord} from '@/app/store/create-group-slice';
import BackButtonWithTitle from '../header/back-button';

type HeaderProps = {
  groupName: string;
  addToCustomersList: (user: ConversationRecord) => void;
};

const Header: React.FC<HeaderProps> = ({groupName, addToCustomersList}) => {
  const {activeTheme} = useTheme();
  const [chatModalVisible, setChatModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-row bg-white pt-6 justify-center items-center h-20 ">
      <View className="w-3/4">
        <BackButtonWithTitle noShadow title={groupName ?? 'Anonymous Name'} />
      </View>
      <View className="w-1/4 bg-white pr-4 p-5 flex-row-reverse	">
        <Pressable
          onPress={() => setChatModalVisible(true)}
          className="w-[10%] items-center">
          <UserPlus fill={activeTheme.primaryColor} width={20} height={20} />
        </Pressable>
      </View>
      <CustomChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
        onSubmit={(user: ConversationRecord) => {
          setChatModalVisible(false);
          addToCustomersList(user);
        }}
      />
    </SafeAreaView>
  );
};

export default Header;
