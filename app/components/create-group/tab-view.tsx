import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '@/app/components/theme-context';

type TabViewProps = {
  activeTab: 'customers' | 'staff';
  onTabChange: (tab: 'customers' | 'staff') => void;
};

const TabView = ({activeTab, onTabChange}: TabViewProps) => {
  const {activeTheme} = useTheme();

  return (
    <View
      className={`w-full flex-row justify-around p-4 border-b border-gray-300 bg-[${activeTheme.primaryColor}]`}>
      <TouchableOpacity
        onPress={() => onTabChange('customers')}
        className={` w-[49.5%] justify-center items-center rounded-lg`}>
        <Text
          className={
            activeTab === 'customers'
              ? activeTheme.buttonText
              : activeTheme.text
          }>
          Customers
        </Text>
      </TouchableOpacity>
      <View className="w-[0.3%] bg-gray-200" />
      <TouchableOpacity
        onPress={() => onTabChange('staff')}
        className={` w-[49.5%] justify-center items-center rounded-lg`}>
        <Text
          className={
            activeTab === 'staff' ? activeTheme.buttonText : activeTheme.text
          }>
          Staff
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabView;
