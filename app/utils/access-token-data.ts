import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";

type AccessTokenData = {
    token?: string;
    access_token?: string;
    refreshToken?: string;
    userId?: string;
}

async function setAccessToken(data: AccessTokenData): Promise<void> {
    const value = JSON.stringify(data);
    try {
        if (Platform.OS === "web") {
            await AsyncStorage.setItem(ACCESS_TOKEN_KEY, value);
        } else {
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, value);
        }
    } catch (error) {
        throw new Error("Failed to set secure data");
    }
}

async function getAccessToken(): Promise<AccessTokenData | null> {
    try {
        let result: string | null;
        if (Platform.OS === "web") {
            result = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        } else {
            result = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        }

        if (result === null) {
            return null;
        }

        const parsedResult = JSON.parse(result);
        return {
            token: parsedResult.token,
            access_token: parsedResult.access_token,
            // Add other properties if needed
        } as AccessTokenData;
    } catch (error) {
        throw new Error("Failed to get secure data");
    }
}

async function clearAccessToken(): Promise<void> {
    try {
        if (Platform.OS === "web") {
            await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        }
    } catch (error) {
        throw new Error("Failed to clear secure data");
    }
}

export {setAccessToken, getAccessToken, clearAccessToken};
