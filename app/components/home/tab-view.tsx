import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '@/app/components/theme-context';

type Tab = {
  key: string;
  label: string;
};

type TabViewProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TabView = ({tabs, activeTab, onTabChange}: TabViewProps) => {
  const {activeTheme} = useTheme();

  return (
    <View className={`w-full flex-row justify-around mt-4`}>
      <TouchableOpacity
        onPress={() => onTabChange(tabs?.[0]?.key)}
        className={`w-[49.5%] justify-center items-center rounded-lg py-2 px-3 ${activeTab === tabs?.[0]?.key ? activeTheme.button : activeTheme.background} ${activeTab === tabs?.[0]?.key ? '' : 'border border-gray-300'} mx-auto`}>
        <Text
          className={
            activeTab === tabs?.[0]?.key
              ? activeTheme.buttonText
              : activeTheme.text
          }>
          {tabs?.[0]?.label}
        </Text>
      </TouchableOpacity>
      <View className="w-[0.3%] bg-gray-200" />
      <TouchableOpacity
        onPress={() => onTabChange(tabs?.[1]?.key)}
        className={`w-[49.5%] justify-center items-center rounded-lg py-2 px-3 ${activeTab === tabs?.[1]?.key ? activeTheme.button : activeTheme.background} ${activeTab === tabs?.[1]?.key ? '' : 'border border-gray-300'} mx-auto`}>
        <Text
          className={
            activeTab === tabs?.[1]?.key
              ? activeTheme.buttonText
              : activeTheme.text
          }>
          {tabs?.[1]?.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabView;
