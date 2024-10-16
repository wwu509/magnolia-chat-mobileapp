import React, {useMemo, useState} from 'react';
import {Pressable, TextInput, TextInputProps, View} from 'react-native';
import {Controller, Control, FieldErrors} from 'react-hook-form';
import formFieldStyles from '@/app/styles/form-field-style';
import {useTheme} from './theme-context';
import {translate} from '@/app/utils/i18n';
import CustomText from './custom-text';
import EyeSvg from '@/assets/svgs/password-eye-svg';
import EyeSlashSvg from '@/assets/svgs/password-eye-slash-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

type CustomFormFieldProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputMode?: TextInputProps['inputMode'];
  errors: FieldErrors<any>;
  containerStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
  errorStyle?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  labelID?: string;
  errorID?: string;
  inputID?: string;
  customIcon?: React.FC<SvgProps>;
};

const CustomFormField: React.FC<CustomFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  inputMode,
  errors,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  autoCapitalize,
  labelID,
  errorID,
  inputID,
  customIcon: CustomIcon,
}) => {
  const {activeTheme} = useTheme();
  const [showPassword, setShowPassword] = useState<boolean>(secureTextEntry);

  const customLabelStyle = useMemo(
    () =>
      labelStyle ? labelStyle : `${formFieldStyles.label} ${activeTheme.label}`,
    [activeTheme.label, labelStyle],
  );

  return (
    <View className={containerStyle && containerStyle}>
      <View className={'flex-row items-center'}>
        <CustomText
          title={'*'}
          classname={`mr-1 mt-2 ${activeTheme.errorText}`}
          testID={'asterisk'}
        />
        <CustomText
          title={label}
          classname={customLabelStyle}
          testID={labelID}
        />
      </View>
      <View
        className={`${formFieldStyles.inputContainer} ${activeTheme.inputBorder}`}>
        {CustomIcon && (
          <View className={'w-[8%]'}>
            <CustomIcon fill={'#9E9E9E'} />
          </View>
        )}
        <Controller
          defaultValue={''}
          control={control}
          name={name}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              testID={inputID}
              accessibilityLabel={inputID}
              className={
                inputStyle
                  ? inputStyle
                  : `${formFieldStyles.input} ${errors?.[name]}  border-0`
              }
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={translate(placeholder) || ''}
              secureTextEntry={showPassword}
              inputMode={inputMode}
              autoCapitalize={autoCapitalize}
            />
          )}
        />
        <View className={'w-[8%]'}>
          {secureTextEntry && (
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeSlashSvg fill={'#9E9E9E'} /> : <EyeSvg />}
            </Pressable>
          )}
        </View>
      </View>
      {errors?.[name] && (
        <CustomText
          testID={errorID}
          title={errors?.[name]?.message?.toString() || ''}
          classname={
            errorStyle
              ? errorStyle
              : `${formFieldStyles.errorText} ${activeTheme.errorText}`
          }
        />
      )}
    </View>
  );
};

export default CustomFormField;
