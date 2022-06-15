import Parser from 'rss-parser';
import type { ParseResult } from '~/types';

const rssParserServer = new Parser();

export const parseRssFromUrl = async (url: string): Promise<ParseResult> => {
  try {
    const result = await rssParserServer.parseURL(url);
    return result as ParseResult;
  } catch (e) {
    console.log(e);
  }
  return { items: [] };
};

export default parseRssFromUrl;
