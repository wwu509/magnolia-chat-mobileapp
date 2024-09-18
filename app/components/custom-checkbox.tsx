import React from 'react';
import {View} from 'react-native';
import {Controller, Control, FieldErrors} from 'react-hook-form';
import Checkbox from 'expo-checkbox';
import checkboxStyles from '@/app/styles/checkbox-style';
import {useTheme} from './theme-context';
import CustomText from './custom-text';
import formFieldStyles from '@/app/styles/form-field-style';

type CustomCheckboxProps = {
  control?: Control<any>;
  name: string;
  label: string;
  errors?: FieldErrors<any>;
  labelID?: string;
  errorID?: string;
  checkBoxID?: string;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  control,
  name,
  label,
  errors,
  labelID,
  errorID,
  checkBoxID,
}) => {
  const {activeTheme} = useTheme();

  return (
    <>
      <View className={checkboxStyles.checkboxContainer}>
        <Controller
          defaultValue={false}
          control={control}
          name={name}
          render={({field: {onChange, value}}) => (
            <Checkbox
              testID={checkBoxID}
              accessibilityLabel={checkBoxID}
              value={value}
              onValueChange={onChange}
              color={
                value
                  ? activeTheme.checkboxChecked
                  : activeTheme.checkboxUnchecked
              }
            />
          )}
        />
        <CustomText
          testID={labelID}
          title={label}
          classname={`${checkboxStyles.checkboxText} ${activeTheme.checkboxText}`}
        />
      </View>
      {errors && errors?.[name] && (
        <CustomText
          testID={errorID}
          title={errors?.[name]?.message?.toString() || ''}
          classname={`${formFieldStyles.errorText} ${activeTheme.errorText}`}
        />
      )}
    </>
  );
};

export default CustomCheckbox;
