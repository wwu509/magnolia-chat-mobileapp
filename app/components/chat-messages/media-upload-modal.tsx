import React from 'react';
import {Modal, View, Text, Pressable, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface UserTypeModalProps {
  isVisible: boolean;
  media: any;
  onClose: () => void;
  onHandleUpload: () => void;
}

const MediaUploadConfirmation: React.FC<UserTypeModalProps> = ({
  isVisible,
  media,
  onClose,
  onHandleUpload,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      {!media ? (
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="p-6 rounded-2xl items-center shadow-lg">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg pt-8 pb-2 px-6 w-80">
            <Pressable className="absolute top-2 right-2" onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>

            <Text className="text-center text-lg mb-4">
              Do you want to upload to this media?
            </Text>

            <View className="h-[1px] bg-gray-300 w-full" />

            <View className="flex-row">
              <Pressable
                className="flex-1 items-center justify-center py-3"
                onPress={() => onHandleUpload()}>
                <Text className="text-base">Yes</Text>
              </Pressable>

              <View className="w-[1px] bg-gray-300 my-2" />

              <Pressable
                className="flex-1 items-center justify-center py-3"
                onPress={() => onClose()}>
                <Text className="text-base">No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default MediaUploadConfirmation;
