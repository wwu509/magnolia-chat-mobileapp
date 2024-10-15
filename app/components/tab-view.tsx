import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
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

  const renderTab = ({item}: {item: Tab}) => {
    const bgColor =
      activeTab === item.key ? activeTheme.button : activeTheme.background;
    const borderColor = activeTab === item.key ? '' : 'border border-gray-300';

    return (
      <TouchableOpacity
        onPress={() => onTabChange(item.key)}
        className={`w-[95%] justify-center items-center rounded-lg py-2 px-3 bg-red-300 ${bgColor} ${borderColor} mx-auto`}>
        <Text
          className={
            activeTab === item.key ? activeTheme.buttonText : activeTheme.text
          }>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => <View className="w-[1] bg-white" />;

  return (
    <View className={`w-full justify-between items-center`}>
      <FlatList
        data={tabs}
        renderItem={renderTab}
        keyExtractor={item => item.key}
        horizontal
        ItemSeparatorComponent={renderSeparator}
        showsHorizontalScrollIndicator={false}
        className="w-full"
      />
    </View>
  );
};

export default TabView;
