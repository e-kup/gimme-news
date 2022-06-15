import type { FC } from 'react';
import { useEffect } from 'react';

import MoonIcon from '~/components/icons/Moon';
import SunIcon from '~/components/icons/Sun';
import useLocalStorage from 'use-local-storage';

export type Theme = 'light' | 'dark' | undefined;

const LIGHT_THEME = 'bumblebee';
const DARK_THEME = 'dracula';
const THEME_ATTR = 'data-theme';

const ThemeSwitch: FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', undefined);
  const isLight = theme === 'light';

  useEffect(() => {
    const defaultDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    if (!theme) {
      setTheme(defaultDark ? 'dark' : 'light');
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const htmlObj = document.getElementsByTagName('html')[0];
    htmlObj?.setAttribute(
      THEME_ATTR,
      theme === 'dark' ? DARK_THEME : LIGHT_THEME,
    );
  }, [theme]);

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        onClick={() => setTheme(isLight ? 'dark' : 'light')}
        defaultChecked={!isLight}
      />
      <span className="flex items-center swap-on fill-current w-10 h-10">
        <SunIcon />
      </span>
      <span className="flex items-center swap-off fill-current w-10 h-10">
        <MoonIcon />
      </span>
    </label>
  );
};

export default ThemeSwitch;
