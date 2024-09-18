import React from "react";
import { Tabs } from "expo-router";
import { translate } from "@/app/utils/i18n";
import { NAVIGATION_ROUTES } from "@/app/constants/navigation-routes";

const TabNavigation: React.FC = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name={NAVIGATION_ROUTES.CHAT}
        options={{
          title: translate("profile"),
          // tabBarIcon: ({color}: {color: string}) => (
          //   <FontAwesome size={28} name="user" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name={NAVIGATION_ROUTES.HOME}
        options={{
          title: translate("home"),
          // tabBarIcon: ({color}: {color: string}) => (
          //   <FontAwesome size={28} name="home" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name={NAVIGATION_ROUTES.SETTING}
        options={{
          title: translate("settings"),
          // tabBarIcon: ({color}: {color: string}) => (
          //   <FontAwesome size={28} name="gear" color={color} />
          // ),
        }}
      />
    </Tabs>
  );
};

export default TabNavigation;
