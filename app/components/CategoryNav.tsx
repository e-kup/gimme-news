import type { FC } from 'react';
import CategoryLink from '~/components/CategoryLink';
import type { SupportedTopic, Topic } from '~/types';
import SparklesIcon from '~/components/icons/Sparkles';
import LoginModalTrigger from '~/components/LoginModalTrigger';
import PlusIcon from '~/components/icons/Plus';
import { Link } from '@remix-run/react';
import { displayedTopics } from '~/config/supportedTopics';

interface CategoryNavProps {
  categoryList: Topic[];
  isUserLogged: boolean;
}

const CategoryNav: FC<CategoryNavProps> = ({ categoryList, isUserLogged }) => {
  const navigation = !isUserLogged
    ? categoryList.filter((category) =>
        displayedTopics.includes(category.id as SupportedTopic),
      )
    : categoryList.filter((category) => category.selected);
  return (
    <nav className="mb-8 text-center flex flex-wrap items-center justify-center">
      <div className="flex flex-wrap items-center justify-center">
        {navigation.map((topic) => (
          <CategoryLink key={topic.id} url={`/category/${topic.id}`}>
            {topic.name}
          </CategoryLink>
        ))}
      </div>
      {!isUserLogged && (
        <LoginModalTrigger id="login-feed">
          <span className="btn gap-2 btn-accent btn-outline mx-4 my-5 lg:my-0 shrink-0">
            Create personal feed
            <SparklesIcon />
          </span>
        </LoginModalTrigger>
      )}
      {isUserLogged && (
        <Link
          to="/account"
          className="btn gap-2 btn-accent btn-outline mx-4 shrink-0"
        >
          Select topic to follow
          <PlusIcon />
        </Link>
      )}
    </nav>
  );
};

export default CategoryNav;
