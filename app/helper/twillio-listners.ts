import {
  Client,
  Conversation,
  ConversationUpdateReason,
  Message,
  MessageUpdateReason,
  Participant,
  ParticipantUpdateReason,
} from '@twilio/conversations';

// Global client variable
let client: Client | null = null;

// Function to initialize the Twilio client and handle initialization events
export const initializeTwilioClient = (token: string): void => {
  client = new Client(token);
  // On successful initialization
  client.on('initialized', () => {
    console.log('Twilio client initialized successfully.');
    setupTwilioListeners(); // Call the function to set up other listeners
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
const setupTwilioListeners = (): void => {
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
    }) => {
      console.log('Conversation updated:');
    },
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
    }) => {
      console.log('Message updated:', message, updateReasons);
    },
  );

  // Listen for participant updates
  client.on(
    'participantUpdated',
    ({
      participant,
      updateReasons,
    }: {
      participant: Participant;
      updateReasons: ParticipantUpdateReason[];
    }) => {
      console.log('Participant updated:', participant, updateReasons);
    },
  );
};

// Optionally, a function to clean up listeners if needed
const removeTwilioListeners = (): void => {
  if (client) {
    client.removeAllListeners();
    console.log('All Twilio listeners removed.');
  }
};
