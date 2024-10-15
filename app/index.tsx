import {Href, Redirect} from 'expo-router';
import {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {getAccessToken} from './utils/access-token-data';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError(
        'Permission not granted to get push token for push notification!',
      );
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function Index() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();
      setIsAuth(!!token?.access_token);
    };

    (async () => await checkToken())();
  }, []);

  if (isAuth === null) {
    return null; // Or a loading spinner if you prefer
  }

  return isAuth ? (
    <Redirect href={NAVIGATION_ROUTES.HOME as Href<string | object>} />
  ) : (
    <Redirect href={NAVIGATION_ROUTES.LOGIN_IN as Href<string | object>} />
  );
}
