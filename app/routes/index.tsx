import { FC } from 'react';
import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';

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
import { getUser, requireUserId, User } from '~/lib/session.server';

interface LoaderData {
  articles: Article[];
  user: User;
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
        },
      })
    : null;

  console.log(userWithArticles);
  return json({
    articles: data.map((article) => ({
      ...article,
      bookmarked: userWithArticles?.articles.some(
        (bookmark) => bookmark.id === article.id,
      ),
    })),
    user,
  });
};

interface FormArticle
  extends Omit<Article, 'publicationDateTimestamp' | 'bookmarked'> {
  publicationDateTimestamp: string;
  bookmarked: string;
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  // eslint-disable-next-line
  try {
    const bookmarked = form.get('bookmarked') as
      | FormArticle['bookmarked']
      | null;
    const id = form.get('id') as FormArticle['id'];
    const title = form.get('title') as FormArticle['title'];
    const description = form.get('description') as FormArticle['description'];
    const imageUrl = form.get('imageUrl') as FormArticle['imageUrl'];
    const url = form.get('link') as FormArticle['link'];
    const pubDate = Number(
      form.get('pubDate'),
    ) as FormArticle['pubDateTimestamp'];

    console.log(bookmarked);
    if (bookmarked) {
      // eslint-disable-next-line
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
                pubDate,
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

const IndexRoute: FC = () => {
  const { articles, user } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const onBookmarkChange = (article: Article, bookmark: boolean) => {
    const { bookmarked, pubDateTimestamp, ...rest } = article;
    // eslint-disable-next-line
    console.log(bookmark);
    submit(
      {
        ...rest,
        pubDateTimestamp: pubDateTimestamp.toString(),
        ...(bookmark && { bookmarked: 'true' }),
      },
      { replace: false, method: 'post' },
    );
  };
  return (
    <PageLayout user={user}>
      <CategoryNav />
      <ArticleGrid>
        {articles.map((item) => {
          const { title, link, id, imageUrl, description, bookmarked } = item;
          const publicationDate = getLocaleFromTimestamp(item.pubDateTimestamp);
          const onChange = (isBookmarked: boolean) =>
            onBookmarkChange(item, isBookmarked);
          return (
            <div key={id}>
              <ArticleCard
                url={link}
                id={id}
                image={imageUrl}
                title={title}
                description={description}
                publicationDate={publicationDate}
                userId={user?.id}
                bookmarked={bookmarked}
                onChange={onChange}
              />
            </div>
          );
        })}
      </ArticleGrid>
      <LoginModal id={'login'} />
    </PageLayout>
  );
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default IndexRoute;
