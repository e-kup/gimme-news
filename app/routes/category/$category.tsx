import { FC } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { fetchArticlesByTopic } from '~/lib/feed';
import ArticleCard from '~/components/ArticleCard';
import ArticleGrid from '~/components/ArticleGrid';
import { Article } from '~/types';
import { isSupportedTopic } from '~/lib/utils';
import CategoryNav from '~/components/CategoryNav';

type LoaderData = Article[];

export const loader: LoaderFunction = async ({ params }) => {
  const { category } = params;
  if (!category || !isSupportedTopic(category)) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const data = await fetchArticlesByTopic(category);
  return json(data);
};

const CategoryRoute: FC = () => {
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
            />
          </div>
        ))}
      </ArticleGrid>
    </>
  );
};

export default CategoryRoute;
