import type {
  Article,
  CategoryFeed,
  Feed,
  RssContent,
  SearchableFeed,
  SupportedTopic,
  Topic,
} from '~/types';
import feed from '~/config/feed';
import supportedTopics from '~/config/supportedTopics';
import type { User } from '~/lib/session.server';
import type {
  getAllTopics,
  getUserWithArticles,
  getUserWithArticlesAndTopics,
  getUserWithTopics,
} from '~/lib/db-actions.server';
import type { getUrlMetaData } from '~/lib/metaData';
import { DESCRIPTION_CHAR_LIMIT } from '~/lib/feed';

export const isCategoryFeed = (feed: Feed): feed is CategoryFeed => {
  return 'categoryPath' in feed;
};

export const isSearchableFeed = (feed: Feed): feed is SearchableFeed => {
  return 'query' in feed;
};

export const getFeedUrl = (feed: Feed): string => {
  return feed.url;
};

export const canGetCategoryArticles = (
  feed: Feed,
): feed is CategoryFeed | SearchableFeed => {
  return isSearchableFeed(feed) || isCategoryFeed(feed);
};

export const getFeedUrlByTopic = (
  feed: Feed,
  topic: SupportedTopic,
): string => {
  if (canGetCategoryArticles(feed)) {
    if (isSearchableFeed(feed)) {
      return `${feed.url}?${feed.query}=${topic}`;
    }

    return `${feed.url}${feed.categoryPath}/${topic}`;
  }
  return feed.url;
};

export const getAllFeedUrls = (): string[] => {
  return feed.filter((feedItem) => !feedItem.topicOnly).map(getFeedUrl);
};

export const getFeedUrlsByTopic = (topic: SupportedTopic): string[] => {
  return feed
    .filter((feedItem) => feedItem.topic.includes(topic))
    .map((feed) => getFeedUrlByTopic(feed, topic));
};

export const isSupportedTopic = (topic: string): topic is SupportedTopic => {
  return supportedTopics.includes(topic as SupportedTopic);
};

export const capitalize = (text: string): string =>
  text.replace(/\b\w/g, (l) => l.toUpperCase());

export const getTimestampFromDateString = (date: string): number => {
  const d = new Date(date);
  return d.getTime();
};

export const getLocaleFromTimestamp = (date: number): string => {
  const d = new Date(date);
  return d.toDateString();
};

export const mapUserWithArticles = (
  data: Awaited<ReturnType<typeof getUserWithArticles>>,
): { articles: Article[]; user: User } => {
  if (!data) {
    return { user: null, articles: [] };
  }
  const { articles, ...user } = data;

  return {
    user,
    articles: articles.map((article) => {
      const { id, pubDateTimestamp, title, description, url, imageUrl } =
        article;
      return {
        id,
        pubDateTimestamp,
        title,
        description,
        link: url,
        imageUrl,
        bookmarked: true,
      };
    }),
  };
};

export const mapUserWithTopics = (
  userData: Awaited<ReturnType<typeof getUserWithTopics>>,
  allTopics: Awaited<ReturnType<typeof getAllTopics>>,
): { user: User; topics: Topic[] } => {
  if (!userData) {
    return {
      user: null,
      topics: allTopics.map((topic) => ({ ...topic, selected: false })),
    };
  }

  const { topics: userTopics, ...user } = userData;

  return {
    user,
    topics: allTopics.map((topic) => {
      const isSelected = userTopics.some(
        (selectedTopic) => selectedTopic.id === topic.id,
      );
      return {
        ...topic,
        selected: isSelected,
      };
    }),
  };
};

export const mapUserWithArticlesAndTopics = (
  userData: Awaited<ReturnType<typeof getUserWithArticlesAndTopics>>,
  allArticles: Awaited<Promise<Article[]>>,
  allTopics: Awaited<ReturnType<typeof getAllTopics>>,
): { articles: Article[]; user: User; topics: Topic[] } => {
  if (!userData) {
    return {
      user: null,
      articles: allArticles,
      topics: allTopics.map((topic) => ({ ...topic, selected: false })),
    };
  }

  const { articles: userArticles, topics: userTopics, ...user } = userData;

  return {
    user,
    articles: allArticles.map((article) => ({
      ...article,
      bookmarked: userArticles.some(
        (bookmarkedArticle) => bookmarkedArticle.id === article.id,
      ),
    })),
    topics: allTopics.map((topic) => {
      const isSelected = userTopics.some(
        (selectedTopic) => selectedTopic.id === topic.id,
      );
      return {
        ...topic,
        selected: isSelected,
      };
    }),
  };
};

export interface FormArticle extends Omit<Article, 'bookmarked' | 'link'> {
  bookmarked: string;
  url: string;
}

export const mapFormArticle = (form: FormData): FormArticle => {
  const id = form.get('id') as FormArticle['id'];
  const bookmarked = form.get('bookmarked') as FormArticle['bookmarked'];
  const title = form.get('title') as FormArticle['title'];
  const description = form.get('description') as FormArticle['description'];
  const imageUrl = form.get('imageUrl') as FormArticle['imageUrl'];
  const url = form.get('link') as FormArticle['url'];
  const pubDateTimestamp = Number(form.get('pubDateTimestamp'));

  return {
    bookmarked,
    id,
    title,
    description,
    imageUrl,
    url,
    pubDateTimestamp,
  };
};

export const mapFormTopics = (form: FormData): { id: string }[] => {
  return Object.keys(Object.fromEntries(form)).map((topicId) => ({
    id: topicId,
  }));
};

export const mapRssItemToArticle = (
  rssItem: RssContent,
  metaData?: Awaited<ReturnType<typeof getUrlMetaData>>,
) => {
  const { title, link, pubDate, guid } = rssItem;
  const pubDateTimestamp = getTimestampFromDateString(pubDate);
  return {
    id: guid,
    title: title,
    link: link,
    pubDateTimestamp,
    imageUrl: metaData?.imageUrl ?? '',
    description:
      (metaData?.description &&
        metaData.description.slice(0, DESCRIPTION_CHAR_LIMIT)) ??
      '',
  };
};

export const getTopicName = (topic: string) => {
  switch (topic) {
    case 'ux': {
      return 'UX';
    }
    case '.net': {
      return 'UX';
    }
    case 'php': {
      return 'PHP';
    }
    default: {
      return capitalize(topic);
    }
  }
};
