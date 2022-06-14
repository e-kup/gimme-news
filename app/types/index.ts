import { OpenGraphImage, OpenGraphProperties } from 'open-graph-scraper';
import supportedTopics from '~/config/supportedTopics';

export type SupportedTopic = typeof supportedTopics[number];

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
  id: string;
  title: string;
  link: string;
  description: string;
  imageUrl: string;
  pubDateTimestamp: number;
  bookmarked: boolean;
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
  guid: string;
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

export interface Topic {
  id: string;
  name: string;
  selected: boolean;
}
