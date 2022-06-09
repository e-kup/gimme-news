import { Article } from '~/types';
import striptags from 'striptags';
import { getFeedUrlsByTopic } from '~/lib/utils';
import { parseRssFromUrl } from '~/lib/parser';

const mergeRssFromVariousSources = (rssData) => {
  return rssData.map((data) => data.items).flat();
};
const mapParsedRssItems = (items: Record<string, any>[]): Article[] => {
  try {
    return items.map((item) => {
      // const img = item?.content?.match(/src="([^"]+)"/);
      // console.log(img);
      return {
        title: item.title,
        link: item.link,
        description: item.content
          ? striptags(item?.content)?.slice(0, 300)
          : '',
      };
    });
  } catch (e) {
    console.log(e);
  }
  return [];
};

export const fetchReactArticles = async () => {
  const articleUrls = getFeedUrlsByTopic('react');
  const parseUrls = await Promise.all(articleUrls.map(parseRssFromUrl));
  const data = mapParsedRssItems(mergeRssFromVariousSources(parseUrls));
  // eslint-disable-next-line
  console.log(data);
  return data;
};
