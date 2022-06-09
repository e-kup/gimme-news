import { LiveReload, Links, Outlet } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import globalStylesUrl from './styles/global.css';
import appStylesUrl from './styles/app.css';

const App = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
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
