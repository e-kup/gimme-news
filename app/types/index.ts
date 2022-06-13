import { OpenGraphImage, OpenGraphProperties } from 'open-graph-scraper';
import supportedTopic from '~/config/supportedTopic';

export type SupportedTopic = typeof supportedTopic[number];

export interface BasicFeed {
  title: string;
  slug: string;
  website: string;
  url: string;
  topic: SupportedTopic[];
}

export interface CategoryFeed extends BasicFeed {
  categoryPath: string;
}

export interface SearchableFeed extends BasicFeed {
  query: string;
}

export type Feed = BasicFeed | CategoryFeed | SearchableFeed;

export interface Article {
  title: string;
  link: string;
  description: string;
  imageUrl: string;
  pubDateTimestamp: number;
}

export type OGMetaDataResult = OpenGraphProperties & {
  ogImage?: OpenGraphImage | OpenGraphImage[] | undefined;
  success: true;
};

export interface MetaData {
  description: string;
  imageUrl?: string;
}

export interface RssContent {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author: string;
  [p: string]: any;
}

export interface ParseResult {
  items: RssContent[];
  [p: string]: any;
}
