import React from 'react';
import {Stack} from 'expo-router';
import {translate} from '../utils/i18n';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';

const ScreensLayout: React.FC = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={`${NAVIGATION_ROUTES.LOGIN_IN}/index`}
        options={{
          title: translate('login'),
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={`${NAVIGATION_ROUTES.REGISTER}/index`}
        options={{
          title: translate('register'),
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={`${NAVIGATION_ROUTES.FORGOT_PASSWORD}/index`}
        options={{
          title: translate('forgot_password'),
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={`${NAVIGATION_ROUTES.OTP}/index`}
        options={{
          title: translate('otp'),
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={`${NAVIGATION_ROUTES.RESET_PASSWORD}/index`}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={`${NAVIGATION_ROUTES.CHAT_MESSAGES}/index`}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={`${NAVIGATION_ROUTES.CREATE_GROUP}/index`}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};

export default ScreensLayout;
