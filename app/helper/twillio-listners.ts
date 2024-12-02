import {
  Client,
  Conversation,
  ConversationUpdateReason,
  Message,
  MessageUpdateReason,
  Participant,
  ParticipantUpdateReason,
} from '@twilio/conversations';
import { addMessage } from '@/app/store/chat-messages-slice';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';

// Global client variable
export let client: Client | null = null;
let messageSid: string = '';
let userName: string = '';
let queryClient: any = '';

const createMessage = async (chatMessage: any) => {
  const conversation = chatMessage?.conversation?._internalState;
  const message = chatMessage?.state;

  if (userName === message?.author && (message?.type === 'media' || message?.attributes?.type === 'video')) {
    return false;
  } else if (messageSid === message?.sid) {
    return false;
  }

  messageSid = message?.sid;

  const currentDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  const imageUrl = message?.attributes?.type === 'video' ? message?.body : await message?.media?.getContentTemporaryUrl();

  return {
    conversationSid: chatMessage?.conversation?.sid,
    messageSid: message?.sid,
    index: message?.index,
    body: message?.type === 'media' || message?.attributes?.type === 'video' ? null : message?.body,
    author: message?.author,
    dateCreated: currentDate,
    dateUpdated: currentDate,
    messageType: message?.type,
    participantSid: message?.participantSid,
    media: message?.type === 'media' || message?.attributes?.type === 'video' ? [{ ContentType: message?.media?.state?.contentType || 'video' }] : null,
    mediaUrls: message?.type === 'media' || message?.attributes?.type === 'video' ? imageUrl : null,
    attributes: message?.attributes,
    isTwilioGeneratedMessage: true,
    user: message?.attributes?.firstName ? {
      firstName: message?.attributes?.firstName,
      lastName: message?.attributes?.lastName,
      role: {
        name: message?.attributes?.role
      }
    } : null,
    client: {
      firstName: message?.author,
      lastName: '',
    },
    conversation: {
      conversationSid: chatMessage?.conversation?.sid,
      attributes: conversation?.attributes,
      dateCreated: currentDate,
      dateUpdated: currentDate,
      friendlyName: conversation?.friendlyName,
      state: conversation?.status,
      uniqueName: conversation?.uniqueName,
      url: `https://conversations.twilio.com/v1/Conversations/${chatMessage?.conversation?.sid}`,
    },
  };
};

// Function to initialize the Twilio client and handle initialization events
export const initializeTwilioClient = (token: string, dispatch: any, newQueryClient: any): void => {
  removeTwilioListeners();
  client = new Client(token);
  queryClient = newQueryClient;
  client.on('initialized', () => {
    console.log('Twilio client initialized successfully.');
    setupTwilioListeners(dispatch); // Call the function to set up other listeners
  });
  client.on('initFailed', ({ error }: { error?: any }) => {
    if (error) {
      console.error('Twilio client initialization failed:', error.message);
    } else {
      console.error(
        'Twilio client initialization failed with an unknown error.',
      );
    }
  });
};

// Function to set up event listeners for Twilio conversations, messages, and participants
const setupTwilioListeners = (dispatch: any): void => {
  if (!client) {
    console.error('Twilio client is not initialized yet.');
    return;
  }

  // Listen for conversation updates
  client.on(
    'conversationUpdated',
    ({
      conversation,
      updateReasons,
    }: {
      conversation: Conversation;
      updateReasons: ConversationUpdateReason[];
    }) => { },
  );

  // Listen for message updates
  client.on(
    'messageUpdated',
    ({
      message,
      updateReasons,
    }: {
      message: Message;
      updateReasons: MessageUpdateReason[];
    }) => { },
  );

  // Listen for message updates
  client.on('messageAdded', async (message: Message) => {
    const newMessage = await createMessage(message);

    if (newMessage) {
      dispatch(addMessage(newMessage));
    }
  });

  // Listen for participant updates
  client.on(
    'participantUpdated',
    ({
      participant,
      updateReasons,
    }: {
      participant: Participant;
      updateReasons: ParticipantUpdateReason[];
    }) => { },
  );

  client.on('tokenAboutToExpire', async () => {
    console.log('Token about to expire, refreshing...');
    queryClient.invalidateQueries({ queryKey: ['chat-token'] });
  });

  client.on('tokenExpired', async () => {
    console.log('Token expired, refreshing...');
    queryClient.invalidateQueries({ queryKey: ['chat-token'] });
  });
};

export const sendMessage = async (
  conversationSid: string,
  message: string,
  user?: any,
  isMedia: boolean = false
): Promise<boolean> => {
  try {
    if (client) {
      userName = user?.userName;
      const conversation = await client.peekConversationBySid(conversationSid);
      if (conversation) {
        if (isMedia) {
          await conversation.prepareMessage().setBody(message).setAttributes({ type: 'video', firstName: user?.first_name, lastName: user?.last_name, role: user?.userRolePermissions?.[0]?.role?.name }).build().send();
        } else {
          await conversation.prepareMessage().setBody(message).setAttributes({ firstName: user?.first_name, lastName: user?.last_name, role: user?.userRolePermissions?.[0]?.role?.name }).build().send();
        }
        return true;
      }
      return false;
    }
  } catch (error) {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      alert('No internet connection. Please try again later');
      return false;
    }
    console.log('Error in sendMessage function:', error);
  }
  return false;
};

export const sendMediaMessage = async (
  conversationSid: string,
  mediaFile: any,
  user?: any
): Promise<boolean> => {
  userName = user?.userName;
  if (client && mediaFile) {
    const formData = new FormData();
    formData.append('file', {
      uri: mediaFile?.uri,
      type: mediaFile?.mimeType,
      name: mediaFile?.fileName,
    } as any);

    const conversation = await client.peekConversationBySid(conversationSid);
    if (conversation) {
      try {
        await conversation.prepareMessage().setBody('').addMedia(formData).setAttributes({ firstName: user?.first_name, lastName: user?.last_name, role: user?.userRolePermissions?.[0]?.role?.name }).buildAndSend();
      } catch (error) {
        console.error('Error sending media:', error);
      }
      return true;
    }
  }
  return false;
};

// Optionally, a function to clean up listeners if needed
const removeTwilioListeners = (): void => {
  if (client) {
    client.removeAllListeners();
    console.log('All Twilio listeners removed.');
  }
};
