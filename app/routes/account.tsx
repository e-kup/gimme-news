import { FC } from 'react';
import type { ActionFunction } from '@remix-run/node';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Topic } from '~/types';

import { db } from '~/lib/db.server';
import { requireUserId, User } from '~/lib/session.server';
import PageLayout from '~/components/PageLayout';

interface LoaderData {
  user: User;
  topics: Topic[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userWithTopics = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      topics: true,
    },
  });
  const topics = await db.topic.findMany({});
  return json({
    user: userWithTopics,
    topics: topics.map((t) => {
      const isSelected = userWithTopics?.topics.some(
        (selectedTopic) => selectedTopic.id === t.id,
      );
      return {
        ...t,
        selected: isSelected,
      };
    }),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  try {
    const selectedTopics = Object.keys(Object.fromEntries(form)).map(
      (topicId) => ({ id: topicId }),
    );
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
    return json(selectedTopics);
  } catch (e) {
    console.log(e);
  }
  return null;
};

const AccountRoute: FC = () => {
  const { user, topics } = useLoaderData<LoaderData>();

  return (
    <PageLayout user={user}>
      <div className="relative text-center base-200">
        <div className="mb-20">
          <h3 className="text-lg font-bold font-poppins mb-6">Your account</h3>
          <div className="flex text-left">
            <p className="mr-5">Username: </p>
            <p>{user?.username}</p>
          </div>
        </div>
        <div className="divider" />
        <div className="mb-20">
          <h3 className="text-lg font-bold font-poppins mb-6">
            Topics you currently follow
          </h3>
          <form method="post">
            <ul className="text-left mb-6 grid grid-cols-2">
              {topics.map((t) => (
                <li key={t.id} className="grid grid-cols-2 py-1 px-3">
                  <span>{t.name}</span>
                  <input
                    key={t.id}
                    name={t.id}
                    type="checkbox"
                    className="toggle toggle-accent"
                    defaultChecked={t.selected}
                  />
                </li>
              ))}
            </ul>
            <button type="submit" className="btn btn-primary">
              Save selection
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountRoute;
