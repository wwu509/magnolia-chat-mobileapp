import React from 'react';
import {Modal, View, Text, Pressable, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import UserDefault from '@/assets/images/user_default.jpg';
import LoginLogo from '@/assets/images/home_logo.png';

interface UserTypeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectUserType: (userType: 'customers' | 'staff') => void;
}

const UserTypeModal: React.FC<UserTypeModalProps> = ({
  isVisible,
  onClose,
  onSelectUserType,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-80">
          <Pressable className="absolute top-2 right-2" onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </Pressable>

          <View className="flex-row justify-around mt-4">
            <Pressable
              className="items-center"
              onPress={() => onSelectUserType('customers')}>
              <View className="w-24 h-24 justify-center items-center">
                <Image
                  source={UserDefault}
                  className="h-full w-full rounded-full"
                />
              </View>
              <Text className="mt-3 text-center">Customers</Text>
            </Pressable>

            <Pressable
              className="items-center"
              onPress={() => onSelectUserType('staff')}>
              <View className="w-24 h-24 justify-center items-center">
                <Image
                  source={LoginLogo}
                  className="h-full w-full rounded-full"
                />
              </View>
              <Text className="mt-3 text-center">Staff</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserTypeModal;
