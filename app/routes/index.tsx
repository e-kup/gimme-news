import { FC } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Article } from '~/types';
import stylesUrl from '~/styles/index.css';
import ArticleCard from '~/components/ArticleCard';
import ArticleGrid from '~/components/ArticleGrid';
import CategoryNav from '~/components/CategoryNav';
import PageLayout from '~/components/PageLayout';
import LoginModal from '~/components/LoginModal';

import { db } from '~/lib/db.server';
import { fetchAllArticles } from '~/lib/feed';
import { getLocaleFromTimestamp } from '~/lib/utils';
import { getUser, User } from '~/lib/session.server';

interface LoaderData {
  articles: Article[];
  user: User;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
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
  return json({
    articles: data,
    user,
  });
};

const IndexRoute: FC = () => {
  const { articles, user } = useLoaderData<LoaderData>();
  return (
    <PageLayout user={user}>
      <CategoryNav />
      <ArticleGrid>
        {articles.map((item) => (
          <div key={item.title}>
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

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default IndexRoute;
