import Parser from 'rss-parser';
import { ParseResult } from '~/types';

const rssParser = new Parser();

export const parseRssFromUrl = async (url: string): Promise<ParseResult> => {
  try {
    const result = await rssParser.parseURL(url);
    return result as ParseResult;
  } catch (e) {
    console.log(e);
  }
  return { items: [] };
};

export default parseRssFromUrl;
