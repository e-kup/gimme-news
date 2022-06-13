import { FC } from 'react';
import supportedTopic from '~/config/supportedTopic';
import CategoryLink from '~/components/CategoryLink';
import { capitalize } from '~/lib/utils';

const CategoryNav: FC = () => {
  return (
    <nav className="mb-5 text-center">
      {supportedTopic.map((topic) => (
        <CategoryLink url={`/category/${topic}`}>
          {capitalize(topic)}
        </CategoryLink>
      ))}
    </nav>
  );
};

export default CategoryNav;
