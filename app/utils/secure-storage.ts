import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

async function setConfidentialData(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch {
    throw new Error("Failed to set secure data");
  }
}

async function getConfidentialData(key: string): Promise<string | null> {
  try {
    let result: string | null;
    if (Platform.OS === "web") {
      result = await AsyncStorage.getItem(key);
    } else {
      result = await SecureStore.getItemAsync(key);
    }

    if (result === null) {
      return null;
    }

    return result;
  } catch {
    throw new Error("Failed to get secure data");
  }
}

export { setConfidentialData, getConfidentialData };
