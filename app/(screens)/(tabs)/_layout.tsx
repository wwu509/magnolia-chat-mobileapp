import React from 'react';
import {Tabs} from 'expo-router';
import {translate} from '@/app/utils/i18n';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import HomeSvg from '@/assets/svgs/home-svg';
import ChatSvg from '@/assets/svgs/chat-svg';
import SettingSvg from '@/assets/svgs/settings-svg';

const TabNavigation: React.FC = () => {
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen
        name={`${NAVIGATION_ROUTES.HOME}/index`}
        options={{
          title: translate('home'),
          tabBarIcon: ({color}: {color: string}) => <HomeSvg />,
        }}
      />
      <Tabs.Screen
        name={`${NAVIGATION_ROUTES.CHAT}/index`}
        options={{
          tabBarLabel: translate('chat'),
          tabBarIcon: ({color}: {color: string}) => <ChatSvg />,
        }}
      />
      <Tabs.Screen
        name={`${NAVIGATION_ROUTES.SETTING}/index`}
        options={{
          title: translate('settings'),
          tabBarIcon: ({color}: {color: string}) => <SettingSvg />,
        }}
      />
    </Tabs>
  );
};

export default TabNavigation;
