import React, {memo} from 'react';
import {Pressable, View} from 'react-native';

interface RightHeaderProps {}

const RightHeader: React.FC<RightHeaderProps> = memo(() => {
  const handleOpen = () => {};

  return (
    <View className="flex-1 flex-row w-full px-[2] items-center justify-end pr-[30]">
      <Pressable onPress={handleOpen} />
      <View className="mr-[20]" />
    </View>
  );
});
export default RightHeader;
