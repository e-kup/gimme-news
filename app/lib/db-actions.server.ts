import { db } from '~/lib/db.server';
import type { FormArticle } from '~/utils';

export const getUserWithArticles = async (userId: string) => {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      articles: {
        orderBy: { pubDateTimestamp: 'desc' },
      },
    },
  });
};

export const getUserWithArticlesAndTopics = async (userId: string) => {
  return await db.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      username: true,
      articles: {
        select: {
          id: true,
        },
      },
      topics: true,
    },
  });
};

export const getAllTopics = async () => {
  return await db.topic.findMany({});
};

export const getUserWithTopics = async (userId: string) => {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      topics: true,
    },
  });
};

export const removeArticleFromUser = async (
  userId: string,
  articleId: string,
) => {
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      articles: {
        disconnect: [{ id: articleId }],
      },
    },
  });
};

export const addArticleToUser = async (userId: string, data: FormArticle) => {
  const { id, title, description, imageUrl, pubDateTimestamp, url } = data;

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      articles: {
        connectOrCreate: {
          where: {
            id,
          },
          create: {
            id,
            title,
            description,
            imageUrl,
            url,
            pubDateTimestamp,
          },
        },
      },
    },
  });
};

export const setTopicsToUser = async (
  userId: string,
  selectedTopics: { id: string }[],
) => {
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      topics: {
        set: selectedTopics,
      },
    },
  });
};
