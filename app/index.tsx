import {Href, Redirect} from 'expo-router';
import {useState, useEffect} from 'react';
import {getAccessToken} from './utils/access-token-data';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';


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
