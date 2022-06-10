import { VFC } from 'react';
import type { LinksFunction } from '@remix-run/node';

import stylesUrl from '~/styles/index.css';
import { useLoaderData } from '@remix-run/react';
import { fetchReactArticles } from '~/lib/feed';
import ArticleCard from '~/components/ArticleCard';
import { Article } from '~/types';
import ArticleGrid from '~/components/ArticleGrid';
import PageLayout from '~/components/PageLayout';

type LoaderData = Article[];

export async function loader() {
  const data = await fetchReactArticles();
  return data;
}

const Test: VFC = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <PageLayout>
      <ArticleGrid>
        {data.map((item) => (
          <div key={item.title}>
            <ArticleCard
              url={item.link}
              image={item.imageUrl}
              title={item.title}
              description={item.description}
            />
          </div>
        ))}
      </ArticleGrid>
    </PageLayout>
  );
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default Test;
