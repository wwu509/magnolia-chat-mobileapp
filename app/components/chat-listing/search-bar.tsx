import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View, TextInput } from "react-native";

const SearchBar: React.FC = () => {
  return (
    <View className="flex-row bg-stone-200 rounded-xl px-4 mx-5 py-3 items-center">
      <MaterialCommunityIcons
        color={"gray"}
        size={18}
        style={{
          marginRight: 10,
          width: "6%",
          marginTop: 2,
        }}
        name={"magnify"}
        onPress={() => {}}
      />
      <TextInput placeholder="Search" className="text-base -mt-1" />
    </View>
  );
};

export default SearchBar;
