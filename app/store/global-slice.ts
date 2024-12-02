import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatListResponse } from "./chat-listing-slice";

// User-related types
type Permission = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    roleId: number;
};

type UserSettings = {
    id: number;
    isTwoFactorAuth: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
};

type UserRolePermission = {
    id: number;
    userId: number;
    roleId: number;
    createdAt: string;
    updatedAt: string;
    role: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
};

export type User = {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    userName: string;
    muteNotifications: boolean;
    isActive: boolean;
    storage_preference: string;
    languagePreference: string;
    createdAt: string;
    updatedAt: string;
    userSettings: UserSettings;
    conversations: ChatListResponse;
    permissions: Permission[];
    userRolePermissions: UserRolePermission[];
    importantConversations: number;
};

// Global state type
export type GlobalState = {
    name: string;
    user: User | null;
    isUpdateMessagesOn: boolean
};

// Root state type
export type RootState = {
    global: GlobalState;
};

const initialState: GlobalState = {
    name: "global",
    user: null,
    isUpdateMessagesOn: false
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setUserData: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUserData: (state) => {
            state.user = null;
        },
        muteUserNotifications: (state, action: PayloadAction<boolean>) => {
            if (state.user) {
                state.user.muteNotifications = action.payload;
            }
        },
        setIsUpdateMessagesOn: (state, action: PayloadAction<boolean>) => {
            state.isUpdateMessagesOn = action.payload;
        },
    },
});

export const { setName, setUserData, clearUserData, muteUserNotifications, setIsUpdateMessagesOn } = globalSlice.actions;

export default globalSlice.reducer;
