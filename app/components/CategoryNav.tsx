import { FC } from 'react';
import supportedTopics from '~/config/supportedTopics';
import CategoryLink from '~/components/CategoryLink';
import { capitalize } from '~/lib/utils';

const CategoryNav: FC = () => {
  return (
    <nav className="mb-5 text-center">
      {supportedTopics.map((topic) => (
        <CategoryLink key={topic} url={`/category/${topic}`}>
          {capitalize(topic)}
        </CategoryLink>
      ))}
    </nav>
  );
};

export default CategoryNav;
