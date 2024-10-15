import * as ImagePicker from 'expo-image-picker';

export type PickImageState = {
    setModalVisible?: (visible: boolean) => void,
    handleReslut: (item: ImagePicker.ImagePickerAsset) => Promise<void>,
    allowsMultipleSelection?: boolean
}

type PickVideoState = {
    handleReslut: (item: ImagePicker.ImagePickerAsset) => Promise<void>,
}

export const pickImage = async ({ setModalVisible = () => { }, handleReslut, allowsMultipleSelection = true }: PickImageState) => {
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
            if (item?.fileName) {
                await handleReslut(item)
            }
        });
    }
};

export const pickVideos = async ({ handleReslut }: PickVideoState) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        result.assets?.forEach(async item => {
            if (item?.fileName) {
                await handleReslut(item)
            }
        });
    }
};