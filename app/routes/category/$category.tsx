import { FC } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { fetchArticlesByTopic } from '~/lib/feed';
import ArticleCard from '~/components/ArticleCard';
import ArticleGrid from '~/components/ArticleGrid';
import { Article } from '~/types';
import { getLocaleFromTimestamp, isSupportedTopic } from '~/lib/utils';
import CategoryNav from '~/components/CategoryNav';
import LoginModal from '~/components/LoginModal';
import { getUser, getUserId, User } from '~/lib/session.server';
import PageLayout from '~/components/PageLayout';

interface LoaderData {
  articles: Article[];
  user: User;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request);
  const { category } = params;
  if (!category || !isSupportedTopic(category)) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const data = await fetchArticlesByTopic(category);
  return json({
    articles: data,
    user,
  });
};

const CategoryRoute: FC = () => {
  const { articles, user } = useLoaderData<LoaderData>();

  return (
    <PageLayout user={user}>
      <CategoryNav />
      <ArticleGrid>
        {articles.map((item) => (
          <div key={item.id}>
            <ArticleCard
              url={item.link}
              image={item.imageUrl}
              title={item.title}
              description={item.description}
              publicationDate={getLocaleFromTimestamp(item.pubDateTimestamp)}
              userId={user?.id}
            />
          </div>
        ))}
      </ArticleGrid>
      <LoginModal id={'login'} />
    </PageLayout>
  );
};

export default CategoryRoute;
