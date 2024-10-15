import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, View, Text, Keyboard} from 'react-native';
import * as yup from 'yup';
import PhoneInput, {ICountry} from 'react-native-international-phone-number';
import {Control, Controller, FieldErrors, useForm} from 'react-hook-form';
import {Root, Content, Trigger, Item, ItemTitle} from 'zeego/dropdown-menu';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomFormField from '@/app/components/custom-form-field';
import {TEST_IDS} from '@/app/constants/test-ids/home-screen';
import {translate} from '@/app/utils/i18n';
import CustomText from '@/app/components/custom-text';
import {useTheme} from '@/app/components/theme-context';
import CustomButton from '@/app/components/custom-button';
import TabView from '../tab-view';
import {newChatTabs} from '@/app/constants';
import {pickImage, pickVideos} from '@/app/helper/media-picker';
import {ImagePickerAsset} from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type CustomModalProps = {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string, message: string, media?: any) => void;
};

type NewChatFormData = {name: string; phone: string; message?: string};

const TextMessageSchema = yup.object().shape({
  name: yup.string().required('enter_your_name'),
  phone: yup.string().required('enter_phone_number'),
  message: yup.string().required('enter_your_message'),
});

const MediaMessageSchema = yup.object().shape({
  name: yup.string().required('enter_your_name'),
  phone: yup.string().required('enter_phone_number'),
});

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  loading,
  onClose,
  onSubmit,
}) => {
  const {activeTheme} = useTheme();

  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [selectedTab, setSelectedTab] = useState<string>('text');
  const [mediaName, setMediaName] = useState<string | null | undefined>();
  const [mediaFormData, setMediaFormData] = useState<any>();

  let schema = selectedTab === 'text' ? TextMessageSchema : MediaMessageSchema;

  const {
    watch,
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<NewChatFormData>({
    resolver: yupResolver(schema),
  });

  const name = watch('name');
  const phone = watch('phone');
  const message = watch('message');

  const handleSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };

  const clearValues = () => {
    setValue('name', '');
    setValue('phone', '');
    setValue('message', '');
  };

  const handleSubmitButton = () => {
    onSubmit(
      name,
      (selectedCountry?.callingCode + phone)?.replace(/[^\d\+]/g, ''),
      message || '',
      mediaFormData,
    );
  };

  const handleRemoveMediaSelection = () => {
    setMediaName('');
    setMediaFormData(null);
  };

  const handleClose = () => {
    clearValues();
    handleRemoveMediaSelection();
    setSelectedTab('text');
    onClose();
  };

  const handleTabSelection = (tab: string) => {
    setSelectedTab(tab);
    setValue('message', '');
    handleRemoveMediaSelection();
  };

  const handleMediaSelection = async (item: ImagePickerAsset) => {
    setMediaName(item?.fileName);
    setMediaFormData({
      uri: item?.uri,
      type: item?.mimeType,
      name: item?.fileName,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      onDismiss={handleClose}>
      <Pressable
        onPress={handleClose}
        className="flex-1 justify-center items-center bg-black/50">
        <Pressable
          onPress={Keyboard.dismiss}
          className="bg-white rounded-3xl p-8 items-center shadow-lg w-[92%]">
          <CustomFormField
            control={control as unknown as Control}
            containerStyle="mb-4 w-[100%]"
            inputStyle="text-base w-[88%]"
            name="name"
            placeholder={'enter_your_name'}
            errors={errors as FieldErrors}
            autoCapitalize="none"
            labelID={TEST_IDS.TEXT.ENTER_YOUR_NAME}
            errorID={TEST_IDS.ERROR.ENTER_YOUR_NAME}
            inputID={TEST_IDS.INPUT.ENTER_YOUR_NAME}
          />
          <Controller
            defaultValue={''}
            control={control}
            name="phone"
            render={({
              field: {onChange, value},
            }: {
              field: {onChange: (value: string) => void; value: string};
            }) => (
              <View>
                <PhoneInput
                  value={value}
                  placeholder={translate('enter_phone_number')}
                  onChangePhoneNumber={onChange}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={handleSelectedCountry}
                  defaultCountry="US"
                  phoneInputStyles={{
                    container: styles.inputContainer,
                    input: styles.input,
                  }}
                />
                {errors?.phone && (
                  <CustomText
                    testID={TEST_IDS.ERROR.ENTER_PHONE_NUMBER}
                    title={errors?.phone?.message?.toString() || ''}
                    classname={`mt-3 ml-1 ${activeTheme.errorText}`}
                  />
                )}
              </View>
            )}
          />
          <View className="w-full mt-4 justify-center items-center">
            <TabView
              tabs={newChatTabs}
              activeTab={selectedTab}
              onTabChange={handleTabSelection}
            />
          </View>
          {selectedTab === 'text' ? (
            <CustomFormField
              control={control as unknown as Control}
              containerStyle="mt-4 w-[100%]"
              inputStyle="text-base w-[88%]"
              inputContainerStyle="h-[100px] items-start"
              name="message"
              placeholder={'enter_your_message'}
              errors={errors as FieldErrors}
              autoCapitalize="none"
              multiline={true}
              labelID={TEST_IDS.TEXT.ENTER_YOUR_MESSAGE}
              errorID={TEST_IDS.ERROR.ENTER_YOUR_MESSAGE}
              inputID={TEST_IDS.INPUT.ENTER_YOUR_MESSAGE}
            />
          ) : (
            <View className="w-full flex-row py-4 mt-4 rounded-lg px-2 border border-gray-500/20 bg-gray-100">
              <View className="w-[90%]">
                <Root>
                  <Trigger>
                    <Text className="text-gray-500">
                      {mediaName || 'Upload attachment here'}
                    </Text>
                  </Trigger>
                  <Content
                    placeholder={''}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}>
                    <Item
                      key="gallery"
                      placeholder={''}
                      onSelect={() => {
                        pickImage({
                          handleReslut: handleMediaSelection,
                          allowsMultipleSelection: false,
                        });
                      }}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}>
                      <ItemTitle>Gallery</ItemTitle>
                    </Item>
                    <Item
                      key="videos"
                      placeholder={''}
                      onSelect={() => {
                        pickVideos({handleReslut: handleMediaSelection});
                      }}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}>
                      <ItemTitle>Videos</ItemTitle>
                    </Item>
                  </Content>
                </Root>
              </View>
              <Pressable
                onPress={handleRemoveMediaSelection}
                className="w-[10%] items-end">
                <MaterialCommunityIcons
                  size={20}
                  color={'gray'}
                  name="close-circle"
                />
              </Pressable>
            </View>
          )}

          <CustomButton
            title={'submit'}
            onPress={handleSubmit(handleSubmitButton)}
            disabled={!name || !phone || !(message || mediaFormData)}
            loading={loading}
            testID={TEST_IDS.BUTTON.SUBMIT}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  input: {width: '50%'},
});
