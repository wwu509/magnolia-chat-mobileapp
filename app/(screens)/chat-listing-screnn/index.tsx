import React from "react";
import { View, Text, ScrollView } from "react-native";
import SearchBar from "@/app/components/chat-listing/search-bar";
import SortBy from "@/app/components/chat-listing/sort-by";
import MessageItem, {
  MessageItemProps,
} from "@/app/components/chat-listing/message-item";
import { SafeAreaView } from "react-native-safe-area-context";

const MessageList: React.FC = () => {
  return (
    <SafeAreaView className="flex flex-col rounded-none w-full  max-w-[90%] m-auto">
      <View className="self-start text-2xl font-bold leading-none text-black">
        <Text className="font-bold mb-2 text-xl">Messages</Text>
      </View>
      <SearchBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex flex-col h-[88%] w-full"
      >
        <SortBy />
        {messages?.map((message, index) => (
          <MessageItem key={index} {...message} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageList;

export const messages: MessageItemProps[] = [
  {
    name: "John Doe",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/6838c05d94de799e219b2f038b65d51451c26755518d55aedc90e2c6a2c919c8?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "How are you doing?",
    time: "16:45",
    isRead: false,
    isOnline: true,
  },
  {
    name: "Travis Barker",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/9fc145aedcb78024e020c64ccfc23378b707e61d012c3457a29342556e5e9551?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "... is typing",
    time: "16:45",
    isRead: false,
    isTyping: true,
  },
  {
    name: "Kate Rose",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8d865a5cf840cd9e162a03530d677d3684357f2f5dae18c0c0f8b8d20cdab25d?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "you: See you tomorrow!",
    time: "16:45",
    isRead: false,
  },
  {
    name: "Robert Parker",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/64b777b9935d9a61bf01ab6e027fd91c90bf93d27292e7a856b98dc56be7992c?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "Awesome!",
    time: "16:45",
    unreadCount: 2,
  },
  {
    name: "Rick Owens",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0396795b9e8953e028b4a5c9c0f770eeab73faedbfba64e4255cf50ac590f62d?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "Good idea 🤩",
    time: "16:45",
    isRead: true,
  },
  {
    name: "George Orwell",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f57d77647f1c28246a138909cd22f9769e16c5fa48e010f1b1c4806379d6baef?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "you: Literally 1984 🤨",
    time: "16:45",
    isRead: true,
  },
  {
    name: "Franz Kafka",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0dbbc406d39a4349b89eea034436016d7a5e53cd49725c6c3cfe5a6d19e56ce1?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "Are you interested in insectitides for..",
    time: "16:45",
    isRead: false,
  },
  {
    name: "Tom Hardy",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1c23960949ee2349a627c2192baf734452af34ae0ae4f4b99e97a475cda9a37c?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "Smells like design spirit..",
    time: "16:45",
    isRead: false,
  },
  {
    name: "Vivienne Westwood",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/61c6d18729334e23ad12c4468374052c5f7f05b99c291e8da0f6a193f19787a1?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "This cat is so funny 😸",
    time: "16:45",
    isRead: false,
  },
  {
    name: "Anthony Paul",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/fea3d2538d1363888f0856b9d1661fec389995b10e026f0da7934ff990affea2?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "Check out my page 🤩",
    time: "16:45",
    isRead: false,
  },
  {
    name: "Stan Smith",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/43bb368c731e6a4887079d65adb1ad8b3c9eed78f4217272a9358c610099ed78?placeholderIfAbsent=true&apiKey=0b93ddd1a0654911b2b793205d440c92",
    message: "Want to see this kicks rn",
    time: "16:45",
    isRead: false,
  },
];
