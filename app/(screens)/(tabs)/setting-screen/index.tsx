import {View} from 'react-native';
import React from 'react';
import {useTheme} from '@/app/components/theme-context';
import styles from '@/app/styles/setting-style';
import CustomText from '@/app/components/custom-text';
import {TEST_IDS} from '@/app/constants/test-ids/setting-screen';

const Setting: React.FC = () => {
  const {activeTheme} = useTheme();

  return (
    <View className={`${styles.container} ${activeTheme.background}`}>
      <CustomText
        title={'setting'}
        classname={`${styles.text} ${activeTheme.text}`}
        testID={TEST_IDS.TEXT.SETTING}
      />
    </View>
  );
};

export default Setting;
