import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types based on the provided data structure
export type ConversationRecord = {
    accountSid?: string;
    participantSid: string;
    participantUserSid?: string;
    participantIdentity?: string;
    conversationSid?: string;
    conversationFriendlyName: string;
    conversationUserName?: string;
};

export type ConversationResponse = {
    count: number;
    records: ConversationRecord[];
};

export type CreateGroupRootState = {
    customers: ConversationRecord[];
    staff: ConversationRecord[];
};

const initialState: CreateGroupRootState = {
    customers: [],
    staff: [],
};

export const createGroupSlice = createSlice({
    name: "createGroup",
    initialState,
    reducers: {
        setCustomersList: (state, action: PayloadAction<ConversationRecord[]>) => {
            state.customers = action?.payload;
        },
        setStaffList: (state, action: PayloadAction<ConversationRecord[]>) => {
            state.staff = action?.payload;
        },
        addCustomersList: (state, action: PayloadAction<ConversationRecord>) => {
            state.customers.push(action?.payload);
        },
    },
});

export const {
    setCustomersList,
    setStaffList,
    addCustomersList,
} = createGroupSlice.actions;

export default createGroupSlice.reducer;
