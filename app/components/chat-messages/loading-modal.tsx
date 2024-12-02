import React from 'react';
import {Modal, View, ActivityIndicator} from 'react-native';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({visible}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="p-6 rounded-2xl items-center shadow-lg">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
