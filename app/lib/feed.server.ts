import { Article, ParseResult, RssContent, SupportedTopic } from '~/types';
import {
  getAllFeedUrls,
  getFeedUrlsByTopic,
  getTimestampFromDateString,
  mapRssItemToArticle,
} from '~/utils';
import { parseRssFromUrl } from '~/lib/rss-parser.server';
import { getUrlMetaData } from '~/lib/metaData.server';
import { isEnglish } from '~/lib/language-detector.server';

const ARTICLES_LIMIT = 30;
export const DESCRIPTION_CHAR_LIMIT = 300;

const getUnique = (feed: RssContent[]): RssContent[] => {
  return feed.reduce<RssContent[]>((feedList, feedItem) => {
    if (
      feedList.some(
        (f) => f.guid === feedItem.guid || f.title === feedItem.title,
      )
    ) {
      return feedList;
    }
    return [...feedList, feedItem];
  }, []);
};

const getEngOnly = (feed: RssContent[]): RssContent[] => {
  return feed.filter((feedItem) => isEnglish(feedItem.title));
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
    const engFeed = getEngOnly(uniqueFeed);
    const randomizedFeed = sortFeed(engFeed);
    const limitedFeed = cropFeed(randomizedFeed);
    const articles = await Promise.all(
      limitedFeed.map(async (rssItem) => {
        if (!rssItem.guid) return undefined;
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
