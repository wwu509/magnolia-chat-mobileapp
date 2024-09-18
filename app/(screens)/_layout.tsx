import React from "react";
import { Stack } from "expo-router";
import { translate } from "../utils/i18n";
import { NAVIGATION_ROUTES } from "@/app/constants/navigation-routes";

const ScreensLayout: React.FC = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={NAVIGATION_ROUTES.LOGIN_IN}
        options={{
          title: translate("login"),
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.FORGOT_PASSWORD_OPTIONS}
        options={{
          title: translate("forgot_password"),
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.FORGOT_PASSWORD}
        options={{
          title: translate("forgot_password"),
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.OTP}
        options={{
          title: translate("otp"),
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.RESET_PASSWORD}
        options={{
          title: translate("reset_password"),
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};

export default ScreensLayout;
