export const AUTH_API = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  ME: 'auth/me',
  OTP_VERIFICATION: 'auth/verify-otp/',
  OTP_RESEND: '/api/auth/resend-otp/',
  FORGOT_PASSWORD: 'auth/forgot-password-otp',
  RESET_PASSWORD: 'auth/reset-password-otp',
  CHANGE_PASSWORD: 'auth/change-password',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refresh',
};

export const CHAT_API = {
  CHAT_TOKEN: 'create-chat-token',
  GET_CHAT_LIST: 'user/conversations',
  SEND_CHAT_MESSAGE: 'chat/send-chat-message',
  CREATE_CHAT: 'conversations',
  GET_CHAT_MESSAGES: 'conversations/messages/',
  CREATE_GROUP: 'conversations/group',
  MARK_AS_IMPORTANT: 'conversations/importance/',
  CHAT_INFO: 'conversations/detail/',
  GROUP_INFO: 'conversations/group/',
  ADD_CUSTOMER_TO_GROUP: 'conversations/group/join/phone-number/',
  ADD_STAFF_TO_GROUP: 'conversations/group/join/identity/',
  REMOVE_USER: 'conversations/participants/',
  GET_STAFF_MEMBERS: 'conversations/available-identities/'
};
