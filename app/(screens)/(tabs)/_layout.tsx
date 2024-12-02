import React, {useEffect} from 'react';
import {Tabs} from 'expo-router';
import {translate} from '@/app/utils/i18n';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import HomeSvg from '@/assets/svgs/home-svg';
import ChatSvg from '@/assets/svgs/chat-svg';
import SettingSvg from '@/assets/svgs/settings-svg';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {useQueryClient} from '@tanstack/react-query';
import {Platform} from 'react-native';

const TabNavigation: React.FC = () => {
  const queryClient = useQueryClient();

  PushNotification.configure({
    onNotification: function (notification) {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.createChannel(
        {
          channelId: 'local-notification', // required
          channelName: 'some channel name',
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
      if (Platform.OS === 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage?.messageId || '',
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          sound: 'default',
        });
      } else {
        PushNotification.localNotification({
          channelId: 'local-notification',
          autoCancel: true,
          bigText: remoteMessage?.notification?.body,
          title: remoteMessage?.notification?.title,
          message: remoteMessage?.notification?.body || '',
          vibrate: true,
          vibration: 300,
          playSound: true,
          soundName: 'default',
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Tabs
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginBottom: -5,
        },
      })}>
      <Tabs.Screen
        name={`${NAVIGATION_ROUTES.HOME}/index`}
        options={{
          title: translate('home'),
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <HomeSvg fill={focused ? '#1e90ff' : 'gray'} />
          ),
        }}
        listeners={() => ({
          tabPress: () => {
            queryClient.invalidateQueries({queryKey: ['aboutMe']});
          },
        })}
      />
      <Tabs.Screen
        name={`${NAVIGATION_ROUTES.CHAT}/index`}
        options={{
          tabBarLabel: translate('chat'),
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <ChatSvg fill={focused ? '#1e90ff' : 'gray'} />
          ),
        }}
        listeners={() => ({
          tabPress: () => {
            queryClient.invalidateQueries({queryKey: ['chats']});
          },
        })}
      />
      <Tabs.Screen
        name={`${NAVIGATION_ROUTES.SETTING}/index`}
        options={{
          title: translate('settings'),
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <SettingSvg fill={focused ? '#1e90ff' : 'gray'} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabNavigation;
