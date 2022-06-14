import { FC } from 'react';
import { useSubmit } from '@remix-run/react';

import { getLocaleFromTimestamp } from '~/lib/utils';
import { User } from '~/lib/session.server';
import { Article, Topic } from '~/types';

import ArticleGridLayout from '~/components/ArticleGridLayout';
import ArticleCard from '~/components/ArticleCard';
import CategoryNav from '~/components/CategoryNav';
import PageLayout from '~/components/PageLayout';
import TopicSelectModal from '~/components/TopicSelectModal';
import LoginModal from '~/components/LoginModal';

interface ArticleGridProps {
  articles: Article[];
  user: User;
  categoryList: Topic[];
}

const ArticlePage: FC<ArticleGridProps> = ({
  articles,
  user,
  categoryList,
}) => {
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
      <CategoryNav
        categoryList={categoryList}
        isUserLogged={Boolean(user?.id)}
      />
      <ArticleGridLayout>
        {articles.map((item) => {
          const { title, link, id, imageUrl, description, bookmarked } = item;
          const publicationDate = getLocaleFromTimestamp(item.pubDateTimestamp);
          const onChange = (isBookmarked: boolean) =>
            onBookmarkChange(item, isBookmarked);
          return (
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
          );
        })}
      </ArticleGridLayout>
      <TopicSelectModal topics={categoryList} />
      <LoginModal id="login-feed" />
    </PageLayout>
  );
};

export default ArticlePage;
