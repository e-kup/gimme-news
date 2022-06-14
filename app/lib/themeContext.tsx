import { createContext, FC, useContext, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';

export type Theme = 'light' | 'dark' | undefined;
export type ThemeSetter = (theme: Theme) => void;

interface ThemeContextValue {
  theme: Theme;
  setTheme: ThemeSetter;
}
const ThemeContext = createContext<ThemeContextValue>({
  theme: undefined,
  setTheme: () => {},
});

export const ThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', undefined);

  useEffect(() => {
    const defaultDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    if (!theme) {
      setTheme(defaultDark ? 'dark' : 'light');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): [Theme, ThemeSetter] => {
  const context = useContext(ThemeContext);
  return [context.theme, context.setTheme];
};
