import React, {useMemo} from 'react';
import {View, Pressable, ActivityIndicator} from 'react-native';
import {useTheme} from './theme-context';
import styles from '@/app/styles/button-style';
import CustomText from './custom-text';

type CustomButtonProps = {
  onPress: () => void;
  title: string;
  buttonStyle?: string;
  textStyle?: string;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  buttonStyle,
  textStyle,
  loading = false,
  disabled = false,
  testID,
}) => {
  const {activeTheme} = useTheme();

  const customButtonStyle = useMemo(
    () =>
      buttonStyle
        ? `${buttonStyle} ${disabled ? activeTheme.buttonDisabled : activeTheme.button}`
        : `${styles.button}  ${disabled ? activeTheme.buttonDisabled : activeTheme.button}`,
    [activeTheme.button, activeTheme.buttonDisabled, buttonStyle, disabled],
  );

  const customTextStyle = useMemo(
    () =>
      textStyle
        ? `${textStyle} ${activeTheme.buttonText}`
        : `${styles.buttonText} ${activeTheme.buttonText}`,
    [activeTheme.buttonText, textStyle],
  );

  return (
    <View className={styles.buttonContainer}>
      <Pressable
        testID={testID}
        accessibilityLabel={testID}
        onPress={onPress}
        className={customButtonStyle}
        disabled={disabled}>
        {loading ? (
          <ActivityIndicator size="small" color={activeTheme.loadingColor} />
        ) : (
          <CustomText title={title} classname={customTextStyle} />
        )}
      </Pressable>
    </View>
  );
};

export default CustomButton;
