import type { FC } from 'react';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { fetchArticlesByTopic } from '~/lib/feed.server';
import type { Article, Topic } from '~/types';
import {
  isSupportedTopic,
  mapFormArticle,
  mapUserWithArticlesAndTopics,
} from '~/utils';
import type { User } from '~/lib/session.server';
import { getUser, requireUserId } from '~/lib/session.server';
import ArticlePage from '~/components/ArticlePage';
import {
  addArticleToUser,
  getAllTopics,
  getUserWithArticlesAndTopics,
  removeArticleFromUser,
} from '~/lib/db-actions.server';

interface LoaderData {
  articles: Article[];
  user: User;
  topics: Topic[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { category } = params;
  if (!category || !isSupportedTopic(category)) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  const allArticles = await fetchArticlesByTopic(category);
  const user = await getUser(request);
  const userWithArticlesAndTopics = user
    ? await getUserWithArticlesAndTopics(user.id)
    : null;

  const allTopics = await getAllTopics();
  return json(
    mapUserWithArticlesAndTopics(
      userWithArticlesAndTopics,
      allArticles,
      allTopics,
    ),
  );
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  try {
    const articleData = mapFormArticle(form);
    if (articleData.bookmarked) {
      await addArticleToUser(userId, articleData);
    } else {
      await removeArticleFromUser(userId, articleData.id);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

const CategoryRoute: FC = () => {
  const { articles, user, topics } = useLoaderData<LoaderData>();
  return <ArticlePage articles={articles} user={user} categoryList={topics} />;
};

export default CategoryRoute;
