import { FC } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { ActionFunction, json } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';

import { fetchArticlesByTopic } from '~/lib/feed';
import ArticleCard from '~/components/ArticleCard';
import ArticleGridLayout from '~/components/ArticleGridLayout';
import { Article } from '~/types';
import { getLocaleFromTimestamp, isSupportedTopic } from '~/lib/utils';
import CategoryNav from '~/components/CategoryNav';
import LoginModal from '~/components/LoginModal';
import { getUser, getUserId, requireUserId, User } from '~/lib/session.server';
import PageLayout from '~/components/PageLayout';
import ArticlePage from '~/components/ArticlePage';
import { db } from '~/lib/db.server';

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

interface FormArticle extends Omit<Article, 'pubDateTimestamp' | 'bookmarked'> {
  pubDateTimestamp: string;
  bookmarked: string;
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  try {
    const bookmarked = form.get('bookmarked') as
      | FormArticle['bookmarked']
      | null;
    const id = form.get('id') as FormArticle['id'];
    const title = form.get('title') as FormArticle['title'];
    const description = form.get('description') as FormArticle['description'];
    const imageUrl = form.get('imageUrl') as FormArticle['imageUrl'];
    const url = form.get('link') as FormArticle['link'];
    const pubDateTimestamp = Number(
      form.get('pubDateTimestamp') as FormArticle['pubDateTimestamp'],
    );

    if (bookmarked) {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          articles: {
            connectOrCreate: {
              where: {
                id,
              },
              create: {
                id,
                title,
                description,
                imageUrl,
                url,
                pubDateTimestamp,
              },
            },
          },
        },
      });
    } else {
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
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

const CategoryRoute: FC = () => {
  const { articles, user } = useLoaderData<LoaderData>();
  return <ArticlePage articles={articles} user={user} />;
};

export default CategoryRoute;
