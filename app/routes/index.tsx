import { FC } from 'react';
import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Article, Topic } from '~/types';
import stylesUrl from '~/styles/index.css';

import { db } from '~/lib/db.server';
import { fetchAllArticles } from '~/lib/feed';
import { getUser, requireUserId, User } from '~/lib/session.server';
import ArticlePage from '~/components/ArticlePage';

interface LoaderData {
  articles: Article[];
  user: User;
  topics: Topic[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const data = await fetchAllArticles();
  const userWithArticles = user
    ? await db.user.findUnique({
        where: {
          id: user.id,
        },

        select: {
          id: true,
          articles: {
            select: {
              id: true,
            },
          },
          topics: true,
        },
      })
    : null;

  const topics = await db.topic.findMany({});
  return json({
    articles: data.map((article) => ({
      ...article,
      bookmarked: userWithArticles?.articles.some(
        (bookmark) => bookmark.id === article.id,
      ),
    })),
    user,
    topics: topics.map((t) => {
      const isSelected = userWithArticles?.topics.some(
        (selected) => selected.id === t.id,
      );
      return {
        ...t,
        selected: isSelected,
      };
    }),
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

//TODO: replace url with link
const IndexRoute: FC = () => {
  const { articles, user, topics } = useLoaderData<LoaderData>();
  return <ArticlePage user={user} articles={articles} categoryList={topics} />;
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default IndexRoute;
