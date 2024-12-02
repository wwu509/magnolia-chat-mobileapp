import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {View, TextInput} from 'react-native';

type SearchBarProps = {
  filter: string;
  handleSearch: (params: {search: string; filter: string}) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({handleSearch, filter}) => {
  return (
    <View className="flex-row bg-gray-200 rounded-xl border border-gray-300 px-4 py-3 items-center shadow-md">
      <Ionicons
        color={'gray'}
        size={25}
        name="search-outline"
        onPress={() => {}}
      />
      <TextInput
        placeholder="Search"
        placeholderTextColor="gray"
        className="w-10/12 ml-2 text-sm -mt-1"
        onChangeText={text => handleSearch({search: text || '', filter})}
      />
    </View>
  );
};

export default SearchBar;
