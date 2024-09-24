import {CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import {useRef, useState} from 'react';
import {
  Button,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CrossIcon from '@/assets/svgs/cross-svg';
import CameraShutter from '@/assets/svgs/shutter-svg';
import CameraFlip from '@/assets/svgs/flip-svg';
import Gallery from '@/assets/svgs/gallery-svg';
import NoFlashIcon from '@/assets/svgs/no-flash-svg';
import FlashIcon from '@/assets/svgs/flash-svg';

export default function CameraLaunch({
  setVisible,
  onHandleGallery,
  getCameraImage,
}: {
  setVisible: (visible: boolean) => void;
  onHandleGallery: () => void;
  getCameraImage: (uri: string, filename: string) => void;
}) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [torchState, setTorchState] = useState<boolean>(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  const padding = Platform.select({ios: 30, android: 10});

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View className="flex">
        <Text>DFASDfd</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex justify-center">
        <Text className="text-center pb-[10]">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const onPictureSaved = (photo: any) => {
    const filenameWithExtension = photo?.uri?.split('/').pop();
    const filename = filenameWithExtension?.split('.').slice(0, -1).join('.');

    getCameraImage(photo?.uri, filename);
    setVisible(false);
  };

  const takePicture = () => {
    if (cameraRef.current) {
      cameraRef.current.takePictureAsync({
        onPictureSaved: onPictureSaved,
      });
    }
  };

  const Flash = torchState ? FlashIcon : NoFlashIcon;

  return (
    <View className="flex justify-center bg-red-200 ">
      <CameraView
        ref={cameraRef}
        className="h-full justify-between pt-5"
        facing={facing}
        enableTorch={torchState}
        mode={'picture'}>
        <View
          className={`flex flex-row justify-between px-[${padding}] py-[10]`}>
          <Pressable
            className="justify-center items-center ml-[20px]"
            onPress={() => setVisible(false)}>
            <CrossIcon height={25} width={25} fill="white" />
          </Pressable>
          <Pressable
            className="p-[10px]"
            onPress={() => setTorchState(!torchState)}>
            <Flash height={35} width={35} fill="white" />
          </Pressable>
        </View>
        <View className="flex flex-row justify-center pb-[70] ">
          <TouchableOpacity className="flex flex-row self-end justify-between w-full px-5">
            <Pressable onPress={onHandleGallery}>
              <Gallery height={35} width={35} fill="white" />
            </Pressable>
            <Pressable onPress={takePicture}>
              <CameraShutter height={40} width={40} fill="white" />
            </Pressable>
            <Pressable onPress={toggleCameraFacing}>
              <CameraFlip height={40} width={40} fill="white" />
            </Pressable>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
