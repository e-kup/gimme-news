import { VFC } from 'react';
import type { LinksFunction } from '@remix-run/node';

import stylesUrl from '~/styles/index.css';

const Test: VFC = () => {
  return <div>test</div>;
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default Test;
