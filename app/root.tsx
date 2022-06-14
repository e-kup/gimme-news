import { LiveReload, Links, Outlet, Scripts } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import globalStylesUrl from './styles/global.css';
import appStylesUrl from './styles/app.css';
import { ThemeProvider } from '~/lib/themeContext';
import AppLayout from '~/components/AppLayout';

const App = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Gimme news</title>
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <AppLayout>
            <Outlet />
          </AppLayout>
        </ThemeProvider>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    { rel: 'stylesheet', href: appStylesUrl },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital@0;1&display=swap',
    },
  ];
};

export default App;
