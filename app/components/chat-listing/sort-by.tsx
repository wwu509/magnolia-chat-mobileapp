import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Root, Content, Trigger, Item, ItemTitle} from 'zeego/dropdown-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type SortByProps = {
  search: string;
  handleSearch: (params: {filter: string; search: string}) => void;
};

const SortBy: React.FC<SortByProps> = ({handleSearch, search}) => {
  const [value, setValue] = useState('All');

  return (
    <View className="flex-row justify-between mt-5 ml-2.5 w-full">
      <View className="grow w-1/2">
        <Text className="text-xs leading-none text-black text-opacity-70">
          Sort by
        </Text>
      </View>
      <View className="flex-row justify-end w-1/2">
        <Root>
          <Trigger>
            <View className="flex-row justify-center items-center">
              <Text className="mr-1">{value}</Text>
              <MaterialCommunityIcons
                color="blue"
                size={12}
                name="arrow-down"
              />
            </View>
          </Trigger>
          <Content
            placeholder={''}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}>
            <Item
              key="all"
              placeholder={''}
              onSelect={() => {
                setValue('All');
                handleSearch({filter: 'all', search});
              }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
              <ItemTitle>All</ItemTitle>
            </Item>
            <Item
              key="important"
              placeholder={''}
              onSelect={() => {
                setValue('Important');
                handleSearch({filter: 'important', search});
              }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
              <ItemTitle>Important</ItemTitle>
            </Item>
            <Item
              key="unread"
              placeholder={''}
              onSelect={() => {
                setValue('Unread');
                handleSearch({filter: 'unread', search});
              }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
              <ItemTitle>Unread</ItemTitle>
            </Item>
          </Content>
        </Root>
      </View>
    </View>
  );
};

export default SortBy;
