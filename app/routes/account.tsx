import type { FC } from 'react';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import type { Topic } from '~/types';

import type { User } from '~/lib/session.server';
import { requireUserId } from '~/lib/session.server';
import PageLayout from '~/components/PageLayout';
import {
  getAllTopics,
  getUserWithTopics,
  setTopicsToUser,
} from '~/lib/db-actions.server';
import { mapFormTopics, mapUserWithTopics } from '~/utils';

interface LoaderData {
  user: User;
  topics: Topic[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userWithTopics = await getUserWithTopics(userId);
  const allTopics = await getAllTopics();
  return json(mapUserWithTopics(userWithTopics, allTopics));
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  try {
    const selectedTopics = mapFormTopics(form);
    await setTopicsToUser(userId, selectedTopics);
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
          <h3 className="text-lg font-bold mb-6">Your account</h3>
          <div className="flex text-left">
            <p className="mr-5">Username: </p>
            <p>{user?.username}</p>
          </div>
        </div>
        <div className="divider" />
        <div className="mb-20">
          <h3 className="text-lg font-bold mb-6">
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
