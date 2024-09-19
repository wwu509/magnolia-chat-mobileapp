import { View, Text, Alert, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@/app/components/theme-context";
import styles from "@/app/styles/setting-style";
import CustomText from "@/app/components/custom-text";
import { TEST_IDS } from "@/app/constants/test-ids/setting-screen";

const Setting: React.FC = () => {
  const { activeTheme } = useTheme();

  // Placeholder logout handler
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => console.log("User logged out") },
    ]);
  };

  // Placeholder change password handler
  const handleChangePassword = () => {
    Alert.alert("Change Password", "Redirecting to change password screen...");
    // Add navigation logic to change password screen if needed
  };

  return (
    <View
      style={[styles.container, { backgroundColor: activeTheme.background }]}
    >
      <Text className="text-lg pt-10 mb-5 text-center px-5 font-bold ">
        Settings
      </Text>
      {/* Change Password Option */}
      <View style={localStyles.optionContainer}>
        <CustomText
          title="Change Password"
          classname={`${styles.text} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.SETTING}
        />
      </View>
      {/* Logout Option */}
      <View style={localStyles.optionContainer}>
        <CustomText
          title="Log out"
          classname={`${styles.text} ${activeTheme.text}`}
          testID={TEST_IDS.TEXT.SETTING}
        />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

export default Setting;
