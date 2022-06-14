import { FC } from 'react';

import MoonIcon from '~/components/icons/Moon';
import SunIcon from '~/components/icons/Sun';
import { useThemeContext } from '~/lib/themeContext';

const ThemeSwitch: FC = () => {
  const [theme, setTheme] = useThemeContext();
  const isLight = theme === 'light';

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        onChange={() => {
          setTheme(isLight ? 'dark' : 'light');
        }}
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
