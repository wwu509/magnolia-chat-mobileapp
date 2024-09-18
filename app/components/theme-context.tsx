import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeStyles from '@/app/styles/theme-style';

type ThemeKeys = keyof typeof themeStyles;

type ThemeStyle = typeof themeStyles.light;

export type ThemeContextType = {
  theme: ThemeKeys;
  activeTheme: typeof themeStyles.light;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [theme, setTheme] = useState<ThemeKeys>('light');
  const [activeTheme, setActiveTheme] = useState<ThemeStyle>(themeStyles.light);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = (await AsyncStorage.getItem(
        'appTheme',
      )) as ThemeKeys | null;
      if (savedTheme && savedTheme in themeStyles) {
        setTheme(savedTheme);
        setActiveTheme(themeStyles[savedTheme] as ThemeStyle);
      }
    };
    (async () => await loadTheme())();
  }, []);

  const setNewTheme = useCallback(
    async (newTheme: ThemeKeys) => {
      setTheme(newTheme);
      await AsyncStorage.setItem('appTheme', newTheme);
      setActiveTheme(themeStyles[newTheme] as ThemeStyle);
    },
    [setTheme, setActiveTheme],
  );

  const toggleTheme = useCallback(async () => {
    const themeOrder: ThemeKeys[] = ['light', 'dark', 'reverse', 'bw'];
    const nextTheme =
      themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
    await setNewTheme(nextTheme);
  }, [setNewTheme, theme]);

  return (
    <ThemeContext.Provider value={{theme, activeTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
