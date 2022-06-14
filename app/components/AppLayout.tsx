import { useThemeContext } from '~/lib/themeContext';
import { FC, useEffect, useState } from 'react';

type UITheme = 'dracula' | 'bumblebee';

const AppLayout: FC = ({ children }) => {
  const [theme] = useThemeContext();
  const [uiTheme, setUITheme] = useState<UITheme>();
  useEffect(() => {
    setUITheme(theme === 'light' ? 'bumblebee' : 'dracula');
  }, [theme]);

  return <div data-theme={uiTheme}>{children}</div>;
};

export default AppLayout;
