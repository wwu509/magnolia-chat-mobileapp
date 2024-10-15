import React from 'react';
import {Modal, View, Pressable} from 'react-native';
import {Image} from 'expo-image';
import CloseSvg from '@/assets/svgs/cross-svg';

type ImageViewerModalProps = {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
};

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isVisible,
  imageUri,
  onClose,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Pressable className="justify-center items-center" onPress={onClose}>
          <CloseSvg />
        </Pressable>
        <View className="w-[90%] h-[70%]">
          <Image
            source={imageUri}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

export default ImageViewerModal;
