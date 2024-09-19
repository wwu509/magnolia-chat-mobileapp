import { NAVIGATION_ROUTES } from "@/app/constants/navigation-routes";
import { navigateTo } from "@/app/helper/navigation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";

export interface MessageItemProps {
  name: string;
  avatar: string;
  message: string;
  time: string;
  isRead?: boolean;
  isOnline?: boolean;
  isTyping?: boolean;
  unreadCount?: number;
}

const MessageItem: React.FC<MessageItemProps> = ({
  name,
  avatar,
  message,
  time,
  isRead = true,
  isOnline = false,
  isTyping = false,
  unreadCount = 0,
}) => {
  return (
    <Pressable
      className="flex flex-row item-center justify-between mt-4 w-full border-b border-gray-300 pb-4"
      onPress={() => navigateTo(NAVIGATION_ROUTES.CHAT_MESSAGES)}
    >
      <View className="flex flex-row text-sm max-w-full">
        <View className="mr-2">
          <Image
            accessibilityLabel={`${name}'s avatar`}
            source={{ uri: avatar }}
            className="object-contain shrink-0 self-stretch my-auto w-11 aspect-square"
          />
        </View>
        <View>
          <View className="flex flex-col self-stretch my-auto w-[178px]">
            <View className="flex gap-1 items-center self-start font-medium text-black text-opacity-80">
              <View className="self-stretch my-auto ">
                <Text className="font-medium text-base">{name}</Text>
              </View>
            </View>
            <View
              className={
                isTyping ? "text-green-500" : "text-black text-opacity-50"
              }
            >
              <Text className="text-base">{message}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-col items-end self-stretch my-auto text-xs leading-none whitespace-nowrap text-black text-opacity-70">
        <View>
          <Text>{time}</Text>
        </View>
        {unreadCount > 0 ? (
          <View className="mt-1 w-5 h-5 text-xs font-medium text-white bg-green-500 rounded-[100px]">
            <Text className="text-center text-white">{unreadCount}</Text>
          </View>
        ) : (
          <MaterialCommunityIcons
            color={"green"}
            size={16}
            style={{ marginTop: 3 }}
            name={isRead ? "check-all" : "check"}
          />
        )}
      </View>
    </Pressable>
  );
};

export default MessageItem;
