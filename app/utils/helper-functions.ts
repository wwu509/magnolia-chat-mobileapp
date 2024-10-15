import moment from 'moment';
import { ChatMessageResponse } from '../store/chat-messages-slice';
import { User } from '../store/global-slice';

export const getMessageFormat = (
    chatMessages: ChatMessageResponse,
    user: User | null,
    mediaFile: any,
    name: string,
    url?: string,
) => {
    const currentDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const chatMesaage = chatMessages?.[0]?.messages?.[0];
    return {
        accountSid: chatMesaage?.accountSid || '',
        attributes: null,
        author: user?.userName,
        body: '',
        conversation: {
            accountSid: chatMesaage?.conversation?.accountSid || '',
            chatServiceSid: chatMesaage?.conversation?.chatServiceSid || '',
            attributes: '{}',
            conversationSid: chatMesaage?.conversation?.conversationSid || '',
            dateCreated: currentDate,
            dateUpdated: currentDate,
            friendlyName: name,
            messagingServiceSid:
                chatMesaage?.conversation?.messagingServiceSid || '',
            state: 'active',
            uniqueName: chatMesaage?.conversation?.uniqueName || '',
            url: url || chatMesaage?.conversation?.url || '',
        },
        conversationSid: chatMesaage?.conversationSid || '',
        dateCreated: currentDate,
        dateUpdated: currentDate,
        index: 9,
        media: [{ ContentType: mediaFile?.mimeType }],
        mediaUrls: [mediaFile?.uri],
        messageSid: chatMesaage?.messageSid || '',
        participantSid: chatMesaage?.participantSid || '',
    };
};


export function capitalizeText(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
