import { CategoryFeed, Feed, SearchableFeed, SupportedTopic } from '~/types';
import feed from '~/config/feed';
import supportedTopics from '~/config/supportedTopics';

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
  if (!canGetCategoryArticles(feed)) {
    throw new Error("this feed can't be filtered by topic");
  }

  if (isSearchableFeed(feed)) {
    return `${feed.url}?${feed.query}=${topic}`;
  }

  return `${feed.url}${feed.categoryPath}/${topic}`;
};

export const getAllFeedUrls = (): string[] => {
  return feed.map(getFeedUrl);
};

export const getFeedUrlsByTopic = (topic: SupportedTopic): string[] => {
  return feed
    .filter(canGetCategoryArticles)
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
