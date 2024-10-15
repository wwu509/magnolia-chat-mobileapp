import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type MessagingBinding = {
    projected_address: string;
    type: string;
};

export type ParticipantDetails = {
    accountSid: string;
    conversationSid: string;
    sid: string;
    identity: string;
    attributes: string;
    messagingBinding: MessagingBinding;
    roleSid: string;
    dateCreated: string;
    dateUpdated: string;
    url: string;
    lastReadMessageIndex: number | null;
    lastReadTimestamp: string | null;
};
// Define types based on the provided data structure
export type Message = {
    messageSid: string;
    accountSid?: string;
    conversationSid: string;
    author?: string;
    body?: string;
    media?: null | any[];
    mediaUrls?: string[];
    attributes?: null | string;
    index?: number;
    participantSid: string;
    dateCreated: string;
    dateUpdated?: string;
    conversation?: Conversation;
};

export type Conversation = {
    conversationSid: string;
    accountSid?: string;
    chatServiceSid?: string;
    messagingServiceSid?: string;
    friendlyName: string;
    uniqueName: string;
    attributes: string;
    state: string;
    dateCreated: string;
    dateUpdated: string;
    url: string;
};

export type MessageGroup = {
    date: string;
    messages: Message[];
};

export type ChatMessageResponse = MessageGroup[];

export type StaffMember = {
    "email": string;
    "name": string;
    "userName": string;
};

export type StaffMemberState = {
    availableIdentities: StaffMember[],
    count: number
}

export type ConversationPermission =
    | 'delete_group'
    | 'update_group'
    | 'remove_members'
    | 'add_members'
    | 'set_attributes'
    | 'send_message'
    | 'view_messages' | '';

export type ChatMessageState = {
    conversationType: 'group' | 'one-to-one' | '';
    conversationWithMessages: ChatMessageResponse;
    permissions?: ConversationPermission[];
    conversationSid?: string;
    staffMembers: StaffMember[];
    isOwner: boolean
};

export type ChatMessageRootState = {
    chatMessages: ChatMessageState;
};

const initialState: ChatMessageState = {
    conversationType: '',
    conversationWithMessages: [],
    permissions: [''],
    conversationSid: '',
    staffMembers: [],
    isOwner: false,
};

export const chatMessagesSlice = createSlice({
    name: "chatMessages",
    initialState,
    reducers: {
        setConversationSid: (state, action: PayloadAction<string>) => {
            state.conversationSid = action.payload;
        },
        setChatMessages: (state, action: PayloadAction<ChatMessageState>) => {
            state.conversationType = action.payload?.conversationType;
            state.isOwner = action.payload?.isOwner;
            state.conversationWithMessages = action.payload?.conversationWithMessages;
            state.permissions = action.payload?.permissions;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            if (state.conversationSid === action.payload?.conversationSid) {
                const { dateCreated } = action.payload;
                const date = dateCreated.split('T')[0];
                const existingGroup = state.conversationWithMessages.find(group => group.date === date);
                if (existingGroup) {
                    existingGroup.messages.push(action.payload);
                } else {
                    state.conversationWithMessages.push({ date, messages: [action.payload] });
                }

                state.conversationWithMessages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            } else {
                console.warn('Converstaion id is not matching');
            }
        },
        clearChatMessages: (state) => {
            state.conversationWithMessages = [];
            state.conversationSid = '';
        },
        setStaffMembers: (state, action: PayloadAction<StaffMember[]>) => {
            state.staffMembers = action.payload;
        },
    },
});

export const { setConversationSid, setChatMessages, addMessage, clearChatMessages, setStaffMembers } = chatMessagesSlice.actions;

export default chatMessagesSlice.reducer;
