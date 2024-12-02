import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define types based on the provided data structure
type Attribute = {
  important: boolean;
};

export type Message = {
  messageSid: string;
  accountSid: string;
  conversationSid: string;
  author: string;
  body: string;
  media?: null | any[];
  mediaUrls?: string[];
  attributes: null | string;
  index: number;
  participantSid: string;
  dateCreated: string;
  dateUpdated: string;
};

export type Conversation = {
  conversationSid: string;
  friendlyName: string;
  uniqueName: string;
  dateCreated: string;
  dateUpdated: string;
  attributes: Attribute;
  latestMessage: Message;
  conversationCustomers: ConversationCustomers[];
  conversationType: string;
};
type ConversationCustomers = {
  conversationSid: string;
  createdAt: string;
  customerId: string;
  email: string | null;
  first_name: string;
  id: number;
  isActive: boolean;
  last_name: string | null;
  mobile: string;
  updatedAt: string;
};

export type ChatListResponse = {
  count: number;
  records: Conversation[];
};

const initialState: ChatListResponse = {
  count: 0,
  records: [],
};

export const chatListSlice = createSlice({
  name: 'chatList',
  initialState,
  reducers: {
    setChatList: (state, action: PayloadAction<ChatListResponse>) => {
      state.count = action.payload?.count;
      state.records = action.payload?.records;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      if (state.records) {
        state.records.push(action.payload);
        state.count += 1;
      } else {
        state.count = 1;
        state.records = [action.payload];
      }
    },
    clearConversationList: state => {
      state.count = 0;
      state.records = [];
    },
  },
});

export const {setChatList, addConversation, clearConversationList} =
  chatListSlice.actions;

export default chatListSlice.reducer;
