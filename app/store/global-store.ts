import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./global-slice";

import chatListingSlice from "./chat-listing-slice";
import chatMessagesSlice from "./chat-messages-slice";
import createGroupSlice from "./create-group-slice";
import userInfoSlice from "./user-profile-slice";
import groupInfoSlice from "./group-info-slice";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    chatListing: chatListingSlice,
    chatMessages: chatMessagesSlice,
    createGroup: createGroupSlice,
    groupInfo: groupInfoSlice,
    userInfo: userInfoSlice,
  },
});

