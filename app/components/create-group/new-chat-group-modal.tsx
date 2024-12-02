import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import PhoneInput, {ICountry} from 'react-native-international-phone-number';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Contacts from 'expo-contacts';

import {translate} from '@/app/utils/i18n';
import {useTheme} from '@/app/components/theme-context';
import {TEST_IDS} from '@/app/constants/test-ids/home-screen';
import {ConversationRecord} from '@/app/store/create-group-slice';

import CustomText from '@/app/components/custom-text';
import CustomButton from '@/app/components/custom-button';
import ContactListModal from '../contacts-list-modal';

type CustomModalProps = {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (user: ConversationRecord) => void;
};

type NewChatFormData = {
  phone: string;
};

const schema = yup.object().shape({
  phone: yup.string().required('enter_phone_number'),
});

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const {activeTheme} = useTheme();

  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const {
    watch,
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<NewChatFormData>({
    resolver: yupResolver(schema),
  });

  const phone = watch('phone');

  const handleSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };

  const clearValues = () => {
    setValue('phone', '');
  };

  const handleSubmitButton = () => {
    const phoneNumber = (selectedCountry?.callingCode + phone)?.replace(
      /[^\d\+]/g,
      '',
    );
    const user = {
      participantSid: phoneNumber,
      conversationFriendlyName: phoneNumber,
    };
    onSubmit(user);
  };

  const handleClose = () => {
    onClose();
    clearValues();
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
        <Pressable
          onPress={handleClose}
          className="flex-1 justify-center items-center bg-black/50">
          <Pressable
            onPress={() => {}}
            className="bg-white rounded-3xl p-8 items-center shadow-lg w-[92%]">
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
            <CustomButton
              title={'choose_from_contacts'}
              onPress={() => setIsContactOpen(true)}
              buttonStyle={
                'w-[100%] h-[45] rounded-md items-center justify-center px-2'
              }
            />
            <CustomButton
              title={'submit'}
              onPress={handleSubmit(handleSubmitButton)}
              disabled={!phone}
              loading={loading}
              testID={TEST_IDS.BUTTON.SUBMIT}
            />
          </Pressable>
        </Pressable>
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
