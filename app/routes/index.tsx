import { VFC } from 'react';
import type { LinksFunction } from '@remix-run/node';

import stylesUrl from '~/styles/index.css';
import { useLoaderData } from '@remix-run/react';
import { fetchReactArticles } from '~/lib/feed';
import { Article } from '~/types';

type LoaderData = Article[];

export async function loader({ request }) {
  const data = await fetchReactArticles();
  return data;
}

const Test: VFC = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 font-poppins">
        all news
      </h1>
      {data.map((item) => (
        <div key={item.title}>
          <a href={item.link}>{item.title}</a>
          <div className="bg-slate-400">{item.description}</div>
          <img src={item.imageUrl} />
        </div>
      ))}
    </>
  );
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default Test;
