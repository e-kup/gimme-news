import { FC } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Article } from '~/types';
import stylesUrl from '~/styles/index.css';
import { fetchAllArticles } from '~/lib/feed';
import ArticleCard from '~/components/ArticleCard';
import ArticleGrid from '~/components/ArticleGrid';
import CategoryNav from '~/components/CategoryNav';

import { db } from '~/lib/db.server';
import { getLocaleFromTimestamp } from '~/lib/utils';

type LoaderData = Article[];

export async function loader() {
  const data = await fetchAllArticles();
  const articles = {
    articles: await db.article.findMany({
      include: {
        users: true,
      },
    }),
  };
  // eslint-disable-next-line
  console.log(articles.articles.map((a) => a.users));
  return json(data);
}

const IndexRoute: FC = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <CategoryNav />
      <ArticleGrid>
        {data.map((item) => (
          <div key={item.title}>
            <ArticleCard
              url={item.link}
              image={item.imageUrl}
              title={item.title}
              description={item.description}
              publicationDate={getLocaleFromTimestamp(item.pubDateTimestamp)}
            />
          </div>
        ))}
      </ArticleGrid>
    </>
  );
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default IndexRoute;
