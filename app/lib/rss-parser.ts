import Parser from 'rss-parser';
import { ParseResult } from '~/types';

const rssParser = new Parser();

export const parseRssFromUrl = async (url: string): Promise<ParseResult> => {
  return (await rssParser.parseURL(url)) as ParseResult;
};

export default parseRssFromUrl;
