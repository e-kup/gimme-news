import { Feed } from '~/types';

const feed: Feed[] = [
  {
    title: 'Smashing Magazine',
    slug: 'smashingmagazine',
    website: 'https://www.smashingmagazine.com',
    url: 'https://www.smashingmagazine.com/feed',
    topic: ['ux', 'design', 'frontend', 'javascript', 'react'],
  },
  // {
  //   title: 'Medium',
  //   slug: 'medium',
  //   website: 'https://medium.com/',
  //   url: 'https://medium.com/feed',
  //   categoryPath: '/tag',
  //   topic: ['ux', 'design', 'frontend', 'javascript', 'react'],
  // },
  {
    title: 'DEV.to',
    slug: 'dev',
    website: 'https://dev.to',
    url: 'https://dev.to/feed',
    categoryPath: '/tag',
    topic: ['ux', 'design', 'frontend', 'javascript', 'react'],
  },
  {
    title: 'Daily JS',
    slug: 'dailyjs',
    website: 'https://medium.com/dailyjs',
    url: 'https://medium.com/feed/dailyjs',
    topic: ['ux', 'design', 'frontend', 'javascript', 'react'],
  },
  {
    title: 'Hacker news',
    slug: 'hackernews',
    website: 'https://hnrss.org/',
    url: 'https://hnrss.org/newest',
    query: 'q',
    topic: ['ux', 'design', 'frontend', 'javascript', 'react'],
  },
];

export default feed;
