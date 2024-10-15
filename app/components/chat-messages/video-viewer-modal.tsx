import React from 'react';
import {Pressable, View, Modal} from 'react-native';
import {ResizeMode, Video} from 'expo-av';
import CloseSvg from '@/assets/svgs/cross-svg';

type VideoPreviewProps = {
  isVisible: boolean;
  videoUri: string | null;
  onClose: () => void;
};

const VideoPreview: React.FC<VideoPreviewProps> = ({
  isVisible,
  videoUri,
  onClose,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View className="flex-1 bg-black/70 justify-center items-center relative">
        <Pressable
          className="justify-center items-center pb-10"
          onPress={onClose}>
          <CloseSvg />
        </Pressable>
        {videoUri && (
          <Video
            className="w-full aspect-square"
            source={{uri: videoUri}}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
          />
        )}
      </View>
    </Modal>
  );
};

export default VideoPreview;
