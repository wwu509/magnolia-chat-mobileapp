import React, {FC} from 'react';
import {Text} from 'react-native';
import Translate from './translate';
import i18n from '@/app/utils/i18n';

type CustomTextProps = {
  classname?: string;
  title?: string;
  dynamicValue?: object;
  onPress?: () => void;
  testID?: string;
  isTranslated?: boolean;
};

const CustomText: FC<CustomTextProps> = ({
  classname = '',
  title = '',
  onPress,
  testID,
  dynamicValue,
  isTranslated = true,
}) => {
  const ns = i18n.language;

  return (
    <Text
      className={classname}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={testID}>
      {isTranslated ? (
        <Translate value={title} ns={ns} dynamicValue={dynamicValue} />
      ) : (
        title
      )}
    </Text>
  );
};

export default CustomText;
