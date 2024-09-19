import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/store/global-slice";
import axiosConfig from "@/app/helper/axios-config";
import { useTheme } from "@/app/components/theme-context";
import { AUTH_API, CHAT_API } from "@/app/constants/api-routes";
import WelcomeSection from "@/app/components/home/welcome-section";
import { useNavigation } from "@react-navigation/native";
import homeScreenStyles from "@/app/styles/home-style";
import { TEST_IDS } from "@/app/constants/test-ids/home-screen";
import CustomText from "@/app/components/custom-text";
import { messages } from "../../chat-listing-screnn";
import MessageItem from "@/app/components/chat-listing/message-item";

const Home = () => {
  const dispatch = useDispatch();
  const { activeTheme } = useTheme();
  const navigation = useNavigation();

  // Fetch user details
  const getUserDetails = useCallback(async () => {
    const { data } = await axiosConfig.get(AUTH_API.ME);
    return data;
  }, []);

  // Fetch chat data
  const getChatData = useCallback(async () => {
    const { data } = await axiosConfig.get(CHAT_API.CHATS); // Replace with the actual API route
    return data;
  }, []);

  const { data: userData } = useQuery({
    queryKey: ["me"],
    queryFn: getUserDetails,
  });

  const { data: chatData } = useQuery({
    queryKey: ["chats"],
    queryFn: getChatData,
  });

  React.useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData));
    }
  }, [userData, dispatch]);

  // Navigate to Start Chat screen
  const handleStartChat = () => {
    navigation.navigate("StartChat"); // Ensure 'StartChat' is registered in your navigation stack
  };

  return (
    <SafeAreaView className={`flex-1  ${activeTheme.background}`}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={activeTheme.background}
      />
      <View className="flex-1 justify-between">
        <WelcomeSection />
        <View className="flex-row justify-between px-5 pt-5 ">
          <View className="w-[47%] bg-blue-600 rounded-lg p-4 justify-center shadow-lg">
            <Text className="text-white text-base text-center">
              Total Chats
            </Text>
            <Text className="text-white font-medium text-base text-center">
              {chatData?.totalChats || 8}
            </Text>
          </View>
          <View className="w-[47%] bg-green-600 rounded-lg p-4 justify-center shadow-lg">
            <Text className="text-white  text-base text-center">Important</Text>
            <Text className="text-white font-bold text-base text-center">
              {chatData?.unreadChats || 7}
            </Text>
          </View>
        </View>
        <Text className="text-lg pt-5 px-5 font-bold ">
          Recent Chats Listing
        </Text>
        <ScrollView className="px-5">
          {/* {chatData?.chats.slice(0, 2).map((chat, index) => ( */}
          {messages.slice(0, 2).map((message, index) => (
            <MessageItem key={index} {...message} />
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleStartChat}
          className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center absolute bottom-6 right-6 shadow-lg"
        >
          <CustomText
            title={"+"}
            classname={`${homeScreenStyles.plus}`}
            testID={TEST_IDS.TEXT.PLUS}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
