import * as ImagePicker from 'expo-image-picker';
import showToast from '../components/toast';
import { Image } from 'react-native-compressor';
import * as FileSystem from 'expo-file-system';

export type PickImageState = {
    setModalVisible?: (visible: boolean) => void,
    handleReslut: (item: ImagePicker.ImagePickerAsset) => Promise<void>,
    allowsMultipleSelection?: boolean
    onStart?: () => void
}

type PickVideoState = {
    handleReslut: (item: ImagePicker.ImagePickerAsset) => Promise<void>,
    onStart: () => void
}

export const pickImage = async ({ setModalVisible = () => { }, handleReslut, allowsMultipleSelection = false, onStart }: PickImageState) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: allowsMultipleSelection,
        cameraType: ImagePicker.CameraType.front,
        aspect: [4, 3],
        quality: 1,
        orderedSelection: true,
        selectionLimit: 30,
    });

    if (!result.canceled) {
        setModalVisible(false);
        result.assets?.forEach(async item => {
            const fileSizeInMB = getFileSizeInMB(item?.fileSize as number); // Convert bytes to MB

            if (fileSizeInMB > 5) {
                showToast('Image size is greater than 5MB')
            } else if (!['image/jpeg', 'image/jpg', 'image/gif', 'image/png'].includes(item?.mimeType || '')) {
                showToast('Only JPEG, JPG, GIF, and PNG formats are supported'); // Show toast if size exceeds 5MB
            }
            else {
                onStart?.();
                await handleReslut(item);
            }
        });
    }
};

export const pickVideos = async ({ handleReslut, onStart, }: PickVideoState) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        aspect: [4, 3],
        quality: 0.5,
    });

    if (!result.canceled) {
        result.assets?.forEach(async item => {
            const fileSizeInMB = getFileSizeInMB(item?.fileSize as number); // Convert bytes to MB

            if (fileSizeInMB > 100) {
                showToast('Video size is greater than 100MB')
            } else if (!['video/mpeg', 'video/mp4', 'video/quicktime', 'video/webm', 'video/3gpp', 'video/3gpp2', 'video/3gpp-tt', 'video/H261', 'video/H263', 'video/H263-1998', 'video/H263-2000', 'video/H264',].includes(item?.mimeType || '')) {
                showToast('Only MPEG, MP4, QuickTime, WebM, 3GPP, H261, H263, and H264 video formats are supported'); // Show toast if size exceeds 5MB
            }
            else {
                onStart();
                await handleReslut(item);
            }
        });
    }
};

export const compressImage = async (uri: string) => {
    const compressedImage = await Image.compress(uri);
    let fileInfo = await FileSystem.getInfoAsync(compressedImage);
    return fileInfo;
}

export const getFileSizeInMB = (fileSize: number) => {
    return (fileSize || 0) / (1024 * 1024)
}