import { FC } from 'react';
import { useSubmit } from '@remix-run/react';

import { getLocaleFromTimestamp } from '~/lib/utils';
import { User } from '~/lib/session.server';
import { Article } from '~/types';

import ArticleGridLayout from '~/components/ArticleGridLayout';
import ArticleCard from '~/components/ArticleCard';
import CategoryNav from '~/components/CategoryNav';
import PageLayout from '~/components/PageLayout';

interface ArticleGridProps {
  articles: Article[];
  user: User;
}

const ArticlePage: FC<ArticleGridProps> = ({ articles, user }) => {
  const submit = useSubmit();
  const onBookmarkChange = (article: Article, bookmark: boolean) => {
    const { bookmarked, pubDateTimestamp, ...rest } = article;
    submit(
      {
        ...rest,
        pubDateTimestamp: String(pubDateTimestamp),
        ...(bookmark && { bookmarked: 'true' }),
      },
      { replace: false, method: 'post' },
    );
  };

  return (
    <PageLayout user={user}>
      <CategoryNav />
      <ArticleGridLayout>
        {articles.map((item) => {
          const { title, link, id, imageUrl, description, bookmarked } = item;
          const publicationDate = getLocaleFromTimestamp(item.pubDateTimestamp);
          const onChange = (isBookmarked: boolean) =>
            onBookmarkChange(item, isBookmarked);
          return (
            <form key={id} id={id}>
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
            </form>
          );
        })}
      </ArticleGridLayout>
    </PageLayout>
  );
};

export default ArticlePage;
