import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import UserCard from '@/app/components/create-group/user-card';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '@/app/components/theme-context';
import {StaffMember} from '@/app/store/chat-messages-slice';
import CustomButton from '../custom-button';

interface StaffListModalProps {
  isVisible: boolean;
  staffMembers: StaffMember[];
  isDataLoading: boolean;
  loading: boolean;
  onClose: () => void;
  onSelectStaff: (staff: string[]) => void;
}

const StaffListModal: React.FC<StaffListModalProps> = ({
  isVisible,
  staffMembers,
  isDataLoading,
  loading,
  onClose,
  onSelectStaff,
}) => {
  const {activeTheme} = useTheme();

  const [selectedStaff, setSelectedStaff] = useState<
    {participantSid: string; conversationFriendlyName: string}[]
  >([]);

  const handleState = (item: StaffMember, index: number) => {
    setSelectedStaff(prev => {
      const existingIndex = prev.findIndex(
        staff => staff.participantSid === `${index}`,
      );
      if (existingIndex !== -1) {
        // Remove the item if it already exists
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        // Add the item if it doesn't exist
        return [
          ...prev,
          {
            participantSid: `${index}`,
            conversationFriendlyName: item?.userName,
          },
        ];
      }
    });
  };

  const clearValues = () => {
    setSelectedStaff([]);
  };

  const hanldeClose = () => {
    onClose();
    clearValues();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={hanldeClose}
      onDismiss={hanldeClose}>
      <SafeAreaView className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-2 w-80 h-[70%]">
          <View className="h-[15%] flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className={`text-lg font-bold ${activeTheme.text}`}>
              Select Staff
            </Text>
            <Ionicons
              name="close"
              size={24}
              color={activeTheme.text}
              onPress={onClose}
            />
          </View>
          {isDataLoading ? (
            <View className="h-[85%] justify-center items-center">
              <ActivityIndicator
                size="large"
                color={activeTheme.linkContainer}
              />
            </View>
          ) : staffMembers?.length === 0 ? (
            <View className="h-[85%] justify-center items-center">
              <Text className="text-base">No staff availiable</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={staffMembers || []}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item: StaffMember, index: number) =>
                  item?.name + index
                }
                className="px-2"
                renderItem={({item, index}) => (
                  <UserCard
                    user={{
                      participantSid: `${index}`,
                      conversationFriendlyName: item?.name,
                    }}
                    selectedUsers={selectedStaff}
                    activeTab="staff"
                    onSelect={() => handleState(item, index)}
                  />
                )}
              />

              <CustomButton
                title={'Add Staff'}
                onPress={() => {
                  const identities = selectedStaff.map(
                    staff => staff.conversationFriendlyName,
                  );
                  onSelectStaff(identities);
                }}
                disabled={selectedStaff?.length === 0}
                loading={loading}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default StaffListModal;
