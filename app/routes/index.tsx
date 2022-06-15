import type { FC } from 'react';
import type { ActionFunction , LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { Article, Topic } from '~/types';

import { fetchAllArticles } from '~/lib/feed';
import type { User } from '~/lib/session.server';
import { getUser, requireUserId } from '~/lib/session.server';
import ArticlePage from '~/components/ArticlePage';
import {
  addArticleToUser,
  getAllTopics,
  getUserWithArticlesAndTopics,
  removeArticleFromUser,
} from '~/lib/db-actions.server';
import { mapFormArticle, mapUserWithArticlesAndTopics } from '~/utils';

interface LoaderData {
  articles: Article[];
  user: User;
  topics: Topic[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const allArticles = await fetchAllArticles();
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

const IndexRoute: FC = () => {
  const { articles, user, topics } = useLoaderData<LoaderData>();
  return <ArticlePage user={user} articles={articles} categoryList={topics} />;
};

export default IndexRoute;
