import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View, Text } from "react-native";

const SortBy: React.FC = () => {
  return (
    <View className="flex-row justify-between my-5 mx-5 ">
      <View className="grow text-xs leading-none text-black text-opacity-70">
        <Text className="font-bold">Sort by</Text>
      </View>
      <View className="flex-row items-center ">
        <View className="self-stretch  my-auto">
          <Text className="font-bold">Newest</Text>
        </View>
        <MaterialCommunityIcons
          color={"blue"}
          size={12}
          style={{
            marginHorizontal: 5,
          }}
          name={"arrow-down"}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default SortBy;
