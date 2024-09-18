import { I18nManager } from 'react-native';
import en from '../locales/en.json';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';
import { i18NameSpace } from '../locales/constant';
import { getConfidentialData } from '@/app/utils/secure-storage';

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        en,
      },
      ur: {
        en,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    ns: [...i18NameSpace],
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date) {
          return dayjs(value)
            .locale(lng || '')
            .format(format);
        }

        return value;
      },
    },
  })
  .then(() => {
  });

export default i18next;

export const setInitialLanguage = async () => {
  try {
    const getLanguage = await getConfidentialData('userLocale');
    if (getLanguage) {
      await i18next.changeLanguage(getLanguage);
    }
  } catch (error) {
    console.warn('error: ', JSON.stringify(error, null, 2));
  }
};

export const translate = (text?: string) => {
  return i18next.t(`${i18next.language}:${text}`);
};

export const Arabic = 'ar';

export const isRTL = async (key: string) => {
  I18nManager.allowRTL(true);
  if (key === Arabic) {
    I18nManager.forceRTL(true);
  } else {
    I18nManager.forceRTL(false);
  }
  await i18next.changeLanguage(key);
};
