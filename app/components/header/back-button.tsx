import React from 'react';
import {View, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {navigateBack, navigateTo} from '@/app/helper/navigation';

type BackButtonWithTitleProps = {
  title: string;
  noShadow?: boolean;
  navigateToPage?: string;
};

const BackButtonWithTitle: React.FC<BackButtonWithTitleProps> = ({
  title,
  noShadow,
  navigateToPage,
}) => {
  return (
    <View
      className={`flex-row bg-white w-full p-4 items-center  ${!noShadow && 'shadow-md'}`}>
      <Ionicons
        name="arrow-back"
        size={25}
        color="black"
        onPress={() =>
          navigateToPage ? navigateTo(navigateToPage) : navigateBack()
        }
        className="absolute left-4"
      />
      <Text className="text-lg  pl-4 font-medium">{title}</Text>
    </View>
  );
};

export default BackButtonWithTitle;
