import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import styles from "@/app/styles/chat-style";
import { useTheme } from "@/app/components/theme-context";
import { messages } from "../../chat-listing-screnn";
import MessageItem from "@/app/components/chat-listing/message-item";
import SearchBar from "@/app/components/chat-listing/search-bar";
import SortBy from "@/app/components/chat-listing/sort-by";

const Profile: React.FC = () => {
  const { activeTheme } = useTheme();

  return (
    <SafeAreaView className={`${styles.container} ${activeTheme.background}`}>
      <Text className="text-lg pt-8 pb-5 px-5 font-bold">Chats Listing</Text>
      <SearchBar />
      <SortBy />
      <ScrollView className="px-5">
        {/* {chatData?.chats.slice(0, 2).map((chat, index) => ( */}
        {messages.map((message, index) => (
          <MessageItem key={index} {...message} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
