import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type MessagingBinding = {
    type: string;
    address: string;
    proxy_address: string;
};

export type Participant = {
    attributes: string;
    identity: string;
    groupOwner: boolean;
    name: string;
    userName: string;
    phoneNumber: string;
    messagingBinding: MessagingBinding | null;
    sid: string;
};

type Conversation = {
    accountSid: string;
    attributes: string;
    chatServiceSid: string;
    chatType: string;
    conversationSid: string;
    dateCreated: string;
    dateUpdated: string;
    friendlyName: string;
    messagingServiceSid: string;
    state: string;
    uniqueName: string;
    url: string;
};

export type UserInfo = {
    conversation: Conversation;
    participants: Participant[];
};

export type UserInfoState = {
    userInfo?: UserInfo | null;
}

export type UserInfoUpdate = Partial<Omit<UserInfo, 'id'>>;

const initialState: UserInfoState = {
    userInfo: null,
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<UserInfo>) {
            state.userInfo = action.payload;
        },
        clearUserInfo(state) {
            state.userInfo = null;
        },
    },
});

export const {
    setUserInfo,
    clearUserInfo,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;