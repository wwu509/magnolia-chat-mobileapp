import React from 'react';
import {View, Pressable} from 'react-native';
import CustomText from '@/app/components/custom-text';

type SvgProps = {
  fill?: string;
};

type VerificationMethodProps = {
  type: string;
  icon: React.FC<SvgProps>;
  selected: boolean;
  onPress: () => void;
  testID?: string;
  buttonID?: string;
};

const VerificationMethod: React.FC<VerificationMethodProps> = ({
  type,
  icon: Icon,
  selected,
  onPress,
  testID,
  buttonID,
}) => {
  const borderClass: string = selected
    ? 'border-blue-700'
    : 'border-neutral-200';
  const iconBgClass: string = selected ? 'bg-blue-700' : 'bg-stone-200';

  return (
    <Pressable
      testID={buttonID}
      accessibilityLabel={buttonID}
      onPress={onPress}
      className={`flex flex-row justify-between items-center p-3 mt-4 w-full rounded-xl border border-solid ${borderClass}`}>
      <View className="flex flex-row items-center my-auto px-3">
        <View
          className={`flex gap-2.5 items-center self-stretch p-3 my-auto w-11 h-11 rounded-lg ${iconBgClass}`}>
          <Icon fill={selected ? '#fff' : '#9E9E9E'} />
        </View>
        <View className="flex flex-col self-stretch my-auto px-3">
          <CustomText
            title={type}
            classname="text-sm font-medium text-neutral-950"
            testID={testID}
          />
        </View>
      </View>
      <View className="flex relative items-start self-stretch my-auto w-6">
        <View
          className={`flex z-0 shrink-0 w-6 h-6 rounded-full border border-solid ${borderClass}`}
        />
        {selected && (
          <View className="flex absolute top-[6] left-[6] z-0 shrink-0 w-3 h-3 bg-blue-700 rounded-full -translate-x-2/4 -translate-y-2/4" />
        )}
      </View>
    </Pressable>
  );
};

export default VerificationMethod;
