import moment from 'moment';
import { ChatMessageResponse, clearChatMessages } from '../store/chat-messages-slice';
import { clearUserData, User } from '../store/global-slice';
import { clearConversationList } from '../store/chat-listing-slice';
import { clearAccessToken } from './access-token-data';
import { replaceRoute } from '../helper/navigation';
import { NAVIGATION_ROUTES } from '../constants/navigation-routes';
import { Href } from 'expo-router';

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
        body: mediaFile?.uri ? null : '',
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
        isTwilioGeneratedMessage: true,
        media: [{ ContentType: mediaFile?.mimeType }],
        mediaUrls: mediaFile?.uri,
        messageSid: chatMesaage?.messageSid || '',
        participantSid: chatMesaage?.participantSid || '',
        smsClient: null,
        customer_id: null,
        client: null,
        user: {
            id: user?.id,
            userName: user?.userName,
            email: user?.email,
            firstName: user?.first_name,
            lastName: user?.last_name,
            role: {
                id: user?.userRolePermissions?.[0]?.role?.id,
                name: user?.userRolePermissions?.[0]?.role?.name
            }
        }
    };
};


export function capitalizeText(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export async function logoutUser(dispatch: (arg0: { payload: undefined; type: "global/clearUserData" | "chatMessages/clearChatMessages" | "chatList/clearConversationList"; }) => void, removeQueries = () => { }) {
    dispatch(clearUserData());
    dispatch(clearChatMessages());
    dispatch(clearConversationList());
    removeQueries();
    await clearAccessToken();
    replaceRoute(NAVIGATION_ROUTES.LOGIN_IN as Href<string | object>);
}
