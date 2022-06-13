import { Article, ParseResult, RssContent, SupportedTopic } from '~/types';
import {
  getAllFeedUrls,
  getFeedUrlsByTopic,
  getTimestampFromDateString,
} from '~/lib/utils';
import { parseRssFromUrl } from '~/lib/rss-parser';
import { getUrlMetaData } from '~/lib/metaData';

const ARTICLES_LIMIT = 10;
const DESCRIPTION_CHAR_LIMIT = 300;

const sortFeed = (feed: RssContent[]): RssContent[] => {
  // return feed.sort(() => Math.random() - 0.5);
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
    const randomizedFeed = sortFeed(feed);
    const limitedFeed = cropFeed(randomizedFeed);
    const articles = Promise.all(
      limitedFeed.map(async (rssItem) => {
        const { title, link, pubDate } = rssItem;
        const pubDateTimestamp = getTimestampFromDateString(pubDate);
        try {
          const metadata = await getUrlMetaData(rssItem.link);
          return {
            title: title,
            link: link,
            pubDateTimestamp,
            imageUrl: metadata?.imageUrl ?? '',
            description:
              (metadata?.description &&
                metadata.description.slice(0, DESCRIPTION_CHAR_LIMIT)) ??
              '',
          };
        } catch (e) {
          return {
            title: title,
            link: link,
            pubDateTimestamp,
            imageUrl: '',
            description: '',
          };
        }
      }),
    );
    return articles;
  } catch (e) {
    console.log("couldn't get map articles, error:", e);
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
