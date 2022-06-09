import Parser from 'rss-parser';

const rssParser = new Parser();

export const parseRssFromUrl = async (url: string) => {
  return await rssParser.parseURL(url);
};
