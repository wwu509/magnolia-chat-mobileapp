import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {View, TextInput} from 'react-native';

type SearchBarProps = {
  filter: string;
  handleSearch: (params: {search: string; filter: string}) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({handleSearch, filter}) => {
  return (
    <View className="flex-row bg-stone-200 rounded-xl px-4 mx-5 py-3 items-center">
      <MaterialCommunityIcons
        color={'gray'}
        size={18}
        style={{
          marginRight: 10,
          width: '6%',
          marginTop: 2,
        }}
        name={'magnify'}
        onPress={() => {}}
      />
      <TextInput
        placeholder="Search"
        className="w-[90%] text-base -mt-1"
        onChangeText={text => handleSearch({search: text || '', filter})}
      />
    </View>
  );
};

export default SearchBar;
