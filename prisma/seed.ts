import { PrismaClient } from '@prisma/client';
import supportedTopics from '~/config/supportedTopics';
import { capitalize } from '~/utils';

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    supportedTopics.map((topic) => {
      return db.topic.create({
        data: {
          id: topic,
          name: capitalize(topic),
        },
      });
    }),
  );
}

seed();
