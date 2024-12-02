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
import TabView from './tab-view';
import {newChatTabs} from '@/app/constants';
import {pickImage} from '@/app/helper/media-picker';
import {ImagePickerAsset} from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {styled} from 'nativewind';
import ContactListModal from '../contacts-list-modal';
import * as Contacts from 'expo-contacts';

type CustomModalProps = {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (
    firstName: string,
    lastName: string,
    phone: string,
    message: string,
    media?: any,
  ) => void;
};

type NewChatFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  message?: string;
};

const TextMessageSchema = yup.object().shape({
  firstName: yup.string().required('enter_your_name'),
  lastName: yup.string().required('enter_your_name'),
  phone: yup.string().required('enter_phone_number'),
  message: yup.string().required('enter_your_message'),
});

const MediaMessageSchema = yup.object().shape({
  firstName: yup.string().required('enter_your_first_name'),
  lastName: yup.string().required('enter_your_last_name'),
  phone: yup.string().required('enter_phone_number'),
});

const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);

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
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

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

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const phone = watch('phone');
  const message = watch('message');

  const handleSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };

  const clearValues = () => {
    setValue('firstName', '');
    setValue('lastName', '');
    setValue('phone', '');
    setValue('message', '');
  };

  const handleSubmitButton = () => {
    onSubmit(
      firstName,
      lastName,
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

  const formatPhoneNumber = (phone: string | undefined = '') => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  const onContactSelection = (contact: Contacts.Contact) => {
    const reformattedPhoneNumber = formatPhoneNumber(
      contact?.phoneNumbers?.[0]?.digits,
    );
    setValue('phone', reformattedPhoneNumber);
    setIsContactOpen(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      onDismiss={handleClose}>
      <>
        <ContactListModal
          visible={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          onSelectContact={onContactSelection}
        />
        <StyledKeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{height: '100%'}}
          className={'w-full'}
          enableOnAndroid>
          <View className="flex-1 justify-center items-center bg-black/50">
            <Pressable
              onPress={Keyboard.dismiss}
              className="bg-white rounded-3xl p-8 pt-4 items-center shadow-lg w-[92%]">
              <View className="w-[100%] items-center pb-5 pt-2">
                <Pressable
                  className="bg-red-500 rounded-full p-1"
                  onPress={handleClose}>
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="white"
                  />
                </Pressable>
              </View>
              <CustomFormField
                control={control as unknown as Control}
                containerStyle="mb-4 w-[100%]"
                inputStyle="text-base w-[88%]"
                name="firstName"
                placeholder={'enter_your_first_name'}
                errors={errors as FieldErrors}
                autoCapitalize="none"
                labelID={TEST_IDS.TEXT.ENTER_YOUR_NAME}
                errorID={TEST_IDS.ERROR.ENTER_YOUR_NAME}
                inputID={TEST_IDS.INPUT.ENTER_YOUR_NAME}
              />
              <CustomFormField
                control={control as unknown as Control}
                containerStyle="mb-4 w-[100%]"
                inputStyle="text-base w-[88%]"
                name="lastName"
                placeholder={'enter_your_last_name'}
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
                  <View className="w-full">
                    <PhoneInput
                      value={value}
                      placeholder={translate('enter_phone_number')}
                      onChangePhoneNumber={onChange}
                      placeholderTextColor="gray"
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
                    <CustomButton
                      title={'choose_from_contacts'}
                      onPress={() => setIsContactOpen(true)}
                      buttonStyle={
                        'w-[100%] h-[45] rounded-md items-center justify-center mt-1.5 px-2'
                      }
                    />
                  </View>
                )}
              />
              <TabView
                tabs={newChatTabs}
                activeTab={selectedTab}
                onTabChange={handleTabSelection}
              />
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
                disabled={
                  !firstName ||
                  !lastName ||
                  !phone ||
                  !(message || mediaFormData)
                }
                loading={loading}
                testID={TEST_IDS.BUTTON.SUBMIT}
              />
            </Pressable>
          </View>
        </StyledKeyboardAwareScrollView>
      </>
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
