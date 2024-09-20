import React, {memo} from 'react';
import {Pressable} from 'react-native';

import {ArrowIconDirections} from '@/app/constants';
import {navigateBack} from '@/app/helper/navigation';
import {TEST_IDS} from '@/app/constants/test-ids/header';

type LeftHeaderProps = {
  navigation: unknown;
};

const LeftHeader: React.FC<LeftHeaderProps> = ({navigation}) => {
  const {ArrowLeft} = ArrowIconDirections;

  return (
    <Pressable
      className="flex-1 flex-row w-full px-[2] items-center justify-center"
      onPress={navigateBack}
      testID={TEST_IDS.BUTTON.BACK_LEFT_ARROW}
      accessibilityLabel={TEST_IDS.BUTTON.BACK_LEFT_ARROW}>
      <ArrowLeft height={20} width={20} />
    </Pressable>
  );
};

export default memo(LeftHeader);
