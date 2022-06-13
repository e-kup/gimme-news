import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  const testUser = await db.user.create({
    data: {
      username: 'test',
      passwordHash: 'tset',
    },
  });
  await Promise.all(
    getArticles().map((article) => {
      return db.article.create({
        data: {
          title: article.title,
          description: article.description,
          imageUrl: article.imageUrl,
          url: article.url,
          users: {
            connect: [{ id: testUser.id }],
          },
        },
      });
    }),
  );
}

seed();

function getArticles() {
  return [
    {
      title: 'Nine JavaScript One-Liners For The Beginner 2021 Developer',
      description:
        'Get a great start into JavaScript by learning these one-liners in just a few minutes!',
      imageUrl:
        'https://miro.medium.com/max/1200/1*fMRLCA7rKDkLyni2mzRcnQ.jpeg',
      url: 'https://medium.com/dailyjs/nine-javascript-one-liners-for-the-beginner-2021-developer-792872ad6137?source=rss----f5105b08f43a---4',
    },
  ];
}
