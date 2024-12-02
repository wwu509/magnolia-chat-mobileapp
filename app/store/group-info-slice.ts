import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MessagingBinding = {
    type: string;
    address: string;
    proxy_address: string;
};

export type Participant = {
    attributes: string;
    identity: string;
    isOwner: boolean;
    name: string;
    userName: string;
    phoneNumber: string;
    messagingBinding: MessagingBinding | null;
    sid: string;
    firstName: string;
    lastName: string
    userId?: number
    role: string;
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

export type GroupInfo = {
    conversation: Conversation;
    participants: Participant[];
    mutedUsers: number[];
};

export type GroupInfoState = {
    groupInfo: GroupInfo | null;
}

const initialState: GroupInfoState = {
    groupInfo: null,
};

const groupInfoSlice = createSlice({
    name: 'groupInfo',
    initialState,
    reducers: {
        setGroupInfo(state, action: PayloadAction<GroupInfo>) {
            state.groupInfo = action.payload;
        },
        addGroupMember(state, action: PayloadAction<Participant>) {
            if (state.groupInfo) {
                state.groupInfo.participants.push(action.payload);
            }
        },
        removeGroupMember(state, action: PayloadAction<string>) {
            if (state.groupInfo) {
                state.groupInfo.participants = state.groupInfo.participants.filter(
                    participant => participant.identity !== action.payload
                );
            }
        },
        clearGroupInfo(state) {
            state.groupInfo = null;
        },
    },
});

export const {
    setGroupInfo,
    addGroupMember,
    removeGroupMember,
    clearGroupInfo,
} = groupInfoSlice.actions;

export default groupInfoSlice.reducer;