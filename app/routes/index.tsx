import { VFC } from 'react';
import type { LinksFunction } from '@remix-run/node';

import stylesUrl from '~/styles/index.css';

const Test: VFC = () => {
  return (
    <h1 className="text-3xl font-bold text-gray-900 font-poppins">
      testing styles
    </h1>
  );
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default Test;
