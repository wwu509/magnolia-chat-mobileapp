import React from 'react';
import {Modal, Pressable} from 'react-native';
import * as yup from 'yup';
import {Control, FieldErrors, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomFormField from '@/app/components/custom-form-field';
import {TEST_IDS} from '@/app/constants/test-ids/home-screen';
import CustomButton from '@/app/components/custom-button';

type CustomModalProps = {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

type NewChatFormData = {
  name: string;
};

const schema = yup.object().shape({
  name: yup.string().required('enter_your_group_name'),
});

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  loading,
  onClose,
  onSubmit,
}) => {
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

  const clearValues = () => {
    setValue('name', '');
  };

  const handleSubmitButton = () => {
    onSubmit(name);
    clearValues();
  };

  const handleClose = () => {
    onClose();
    clearValues();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <Pressable
        onPress={handleClose}
        className="flex-1 justify-center items-center bg-black/50">
        <Pressable
          onPress={() => {}}
          className="bg-white rounded-3xl p-8 items-center shadow-lg w-[92%]">
          <CustomFormField
            control={control as unknown as Control}
            containerStyle="mb-4 w-[100%]"
            inputStyle="text-base w-[88%]"
            name="name"
            placeholder={'enter_your_group_name'}
            errors={errors as FieldErrors}
            autoCapitalize="none"
            labelID={TEST_IDS.TEXT.ENTER_YOUR_NAME}
            errorID={TEST_IDS.ERROR.ENTER_YOUR_NAME}
            inputID={TEST_IDS.INPUT.ENTER_YOUR_NAME}
          />
          <CustomButton
            title={'submit'}
            onPress={handleSubmit(handleSubmitButton)}
            disabled={name?.length < 3}
            loading={loading}
            testID={TEST_IDS.BUTTON.SUBMIT}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;