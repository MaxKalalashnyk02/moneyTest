import React, {createContext, useState, useContext, useEffect} from 'react';
import {useColorScheme} from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(
    deviceTheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
  }, [deviceTheme]);

  const toggleTheme = () => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider
      value={{theme, toggleTheme, isDark: theme === 'dark'}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
