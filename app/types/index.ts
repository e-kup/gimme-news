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
}
