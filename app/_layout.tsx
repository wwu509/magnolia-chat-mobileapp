import {FC, useCallback, useEffect} from 'react';
import {Stack} from 'expo-router';
import {NativeWindStyleSheet} from 'nativewind';
import {Provider} from 'react-redux';
import {store} from './store/global-store';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootSiblingParent} from 'react-native-root-siblings';
import * as SplashScreen from 'expo-splash-screen';
import {ThemeProvider} from './components/theme-context';
import i18n, {isRTL, setInitialLanguage} from './utils/i18n';
import {injectStore} from './utils/storeDispatch';

const queryClient = new QueryClient();
injectStore(store);
SplashScreen.preventAutoHideAsync();

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const RootLayout: FC = () => {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };
    setTimeout(hideSplashScreen, 2000);
  }, []);

  const i18LanguageConfig = useCallback(async () => {
    try {
      await setInitialLanguage();
      await isRTL(i18n?.language);
    } catch (error) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, []);

  useEffect(() => {
    i18LanguageConfig().then(() => {});
  }, [i18LanguageConfig]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RootSiblingParent>
          <ThemeProvider>
            <Stack screenOptions={{headerShown: false}}>
              <Stack.Screen name="index" />
            </Stack>
          </ThemeProvider>
        </RootSiblingParent>
      </Provider>
    </QueryClientProvider>
  );
};

export default RootLayout;
