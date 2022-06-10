import { OpenGraphImage, OpenGraphProperties } from 'open-graph-scraper';

export type SupportedTopic =
  | 'ux'
  | 'design'
  | 'frontend'
  | 'javascript'
  | 'react';

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
