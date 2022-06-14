import { FC } from 'react';
import type { ActionFunction } from '@remix-run/node';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';

import { Article } from '~/types';
import ArticleCard from '~/components/ArticleCard';
import ArticleGridLayout from '~/components/ArticleGridLayout';
import PageLayout from '~/components/PageLayout';

import { db } from '~/lib/db.server';
import { getLocaleFromTimestamp } from '~/lib/utils';
import { requireUserId, User } from '~/lib/session.server';

interface LoaderData {
  articles: Article[];
  user: User;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userWithArticles = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      articles: {
        orderBy: { pubDateTimestamp: 'desc' },
      },
    },
  });
  if (!userWithArticles) return { user: null, articles: [] };
  const { articles, ...user } = userWithArticles;

  return json({
    user,
    articles: articles.map((article) => ({
      ...article,
      bookmarked: true,
    })),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  // eslint-disable-next-line
  try {
    const id = form.get('id') as string;
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        articles: {
          disconnect: [{ id }],
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
  return null;
};

const BookmarksRoute: FC = () => {
  const { articles, user } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const onBookmarkChange = (id: Article['id']) => {
    submit(
      {
        id,
      },
      { replace: false, method: 'post' },
    );
  };
  return (
    <PageLayout user={user}>
      <ArticleGridLayout>
        {articles.map((item) => {
          const { title, link, id, imageUrl, description, bookmarked } = item;
          const publicationDate = getLocaleFromTimestamp(item.pubDateTimestamp);
          const onChange = () => onBookmarkChange(id);
          return (
            <div key={id}>
              <ArticleCard
                url={link}
                image={imageUrl}
                title={title}
                description={description}
                publicationDate={publicationDate}
                isUserLogged={Boolean(user?.id)}
                bookmarked={bookmarked}
                onChange={onChange}
              />
            </div>
          );
        })}
      </ArticleGridLayout>
    </PageLayout>
  );
};

export default BookmarksRoute;
