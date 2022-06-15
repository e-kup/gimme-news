import {
  LiveReload,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import appStylesUrl from './styles/app.css';

const App = () => {
  return (
    <html lang="en" data-theme="dracula">
      <head>
        <meta charSet="utf-8" />
        <title>Gimme news</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: appStylesUrl },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital@0;1&display=swap',
    },
  ];
};

export default App;
