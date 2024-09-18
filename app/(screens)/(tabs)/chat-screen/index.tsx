import { View } from "react-native";
import React from "react";
import styles from "@/app/styles/chat-style";
import { useTheme } from "@/app/components/theme-context";

const Profile: React.FC = () => {
  const { activeTheme } = useTheme();

  return (
    <View className={`${styles.container} ${activeTheme.background}`}></View>
  );
};

export default Profile;
