import type { Article, ParseResult, RssContent, SupportedTopic } from '~/types';
import {
  getAllFeedUrls,
  getFeedUrlsByTopic,
  getTimestampFromDateString,
  mapRssItemToArticle,
} from '~/utils';
import { parseRssFromUrl } from '~/lib/rss-parser.server';
import { getUrlMetaData } from '~/lib/metaData.server';

const ARTICLES_LIMIT = 30;
export const DESCRIPTION_CHAR_LIMIT = 300;

const getUnique = (feed: RssContent[]): RssContent[] => {
  return feed.reduce<RssContent[]>((feedList, feedItem) => {
    const isAlreadyInList = feedList.some(
      (f) => f.guid === feedItem.guid || f.title === feedItem.title,
    );
    if (isAlreadyInList) {
      return feedList;
    }
    return [...feedList, feedItem];
  }, []);
};

const sortFeed = (feed: RssContent[]): RssContent[] => {
  return feed.sort(
    (a, b) =>
      getTimestampFromDateString(b.pubDate) -
      getTimestampFromDateString(a.pubDate),
  );
};

const cropFeed = (feed: RssContent[]): RssContent[] => {
  return feed.slice(0, ARTICLES_LIMIT);
};

const prepareData = async (feed: RssContent[]): Promise<Article[]> => {
  try {
    const uniqueFeed = getUnique(feed);
    const randomizedFeed = sortFeed(uniqueFeed);
    const limitedFeed = cropFeed(randomizedFeed);
    const articles = await Promise.all(
      limitedFeed.map(async (rssItem) => {
        try {
          const metadata = await getUrlMetaData(rssItem.guid);
          return metadata ? mapRssItemToArticle(rssItem, metadata) : undefined;
        } catch (e) {
          console.log(e);
          return undefined;
        }
      }),
    );
    return articles.filter(Boolean) as Article[];
  } catch (e) {
    console.log("couldn't prepare articles, error:", e);
  }
  return [];
};

const mergeContentFromVariousSources = (
  rssData: ParseResult[],
): RssContent[] => {
  return rssData.map((data) => data.items).flat();
};

export const fetchArticlesByTopic = async (topic: SupportedTopic) => {
  const articleUrls = getFeedUrlsByTopic(topic);
  const parsedContent = await Promise.all(articleUrls.map(parseRssFromUrl));
  const mergedContent = mergeContentFromVariousSources(parsedContent);
  const data = await prepareData(mergedContent);
  return data;
};

export const fetchAllArticles = async () => {
  const articleUrls = getAllFeedUrls();
  const parsedContent = await Promise.all(articleUrls.map(parseRssFromUrl));
  const mergedContent = mergeContentFromVariousSources(parsedContent);
  const data = await prepareData(mergedContent);
  return data;
};
