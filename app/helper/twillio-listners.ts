import {
  Client,
  Conversation,
  ConversationUpdateReason,
  Message,
  MessageUpdateReason,
  Participant,
  ParticipantUpdateReason,
} from '@twilio/conversations';
import {addMessage} from '@/app/store/chat-messages-slice';
import moment from 'moment';

// Global client variable
let client: Client | null = null;
let messageSid: string = '';

const createMessage = (chatMessage: any) => {
  const conversation = chatMessage?.conversation?._internalState;
  const message = chatMessage?.state;

  if (messageSid === message?.sid || message?.type === 'media') {
    return false;
  }
  messageSid = message?.sid;
  const currentDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  return {
    conversationSid: chatMessage?.conversation?.sid,
    messageSid: message?.sid,
    index: message?.index,
    body: message?.body,
    author: message?.author,
    dateCreated: currentDate,
    dateUpdated: currentDate,
    messageType: message?.type,
    participantSid: message?.participantSid,
    media: null,
    mediaUrls: [],
    attributes: message?.attributes,
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
export const initializeTwilioClient = (token: string, dispatch: any): void => {
  client = new Client(token);
  // On successful initialization
  client.on('initialized', () => {
    console.log('Twilio client initialized successfully.');
    setupTwilioListeners(dispatch); // Call the function to set up other listeners
  });
  client.on('initFailed', ({error}: {error?: any}) => {
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
    }) => {},
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
    }) => {},
  );

  // Listen for message updates
  client.on('messageAdded', async (message: Message) => {
    const newMessage = createMessage(message);

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
    }) => {},
  );
};

export const sendMessage = async (
  conversationSid: string,
  message: string,
): Promise<boolean> => {
  if (client) {
    const conversation = await client.peekConversationBySid(conversationSid);

    if (conversation) {
      await conversation.sendMessage(message);
      return false;
    }
  }
  return false;
};

export const sendMediaMessage = async (
  conversationSid: string,
  mediaFile: any,
): Promise<boolean> => {
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
        await conversation.sendMessage(formData);
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
