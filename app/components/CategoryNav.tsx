import { FC } from 'react';
import CategoryLink from '~/components/CategoryLink';
import { Topic } from '~/types';
import SparklesIcon from '~/components/icons/Sparkles';
import LoginModalTrigger from '~/components/LoginModalTrigger';
import PlusIcon from '~/components/icons/Plus';
import { Link } from '@remix-run/react';

interface CategoryNavProps {
  categoryList: Topic[];
  isUserLogged: boolean;
}

const CategoryNav: FC<CategoryNavProps> = ({ categoryList, isUserLogged }) => {
  const navigation = !isUserLogged
    ? categoryList
    : categoryList.filter((category) => category.selected);
  return (
    <nav className="mb-8 text-center">
      {navigation.map((topic) => (
        <CategoryLink key={topic.id} url={`/category/${topic.id}`}>
          {topic.name}
        </CategoryLink>
      ))}
      {!isUserLogged && (
        <LoginModalTrigger id="login-feed">
          <span className="btn gap-2 btn-accent btn-outline mx-4">
            Create personal feed
            <SparklesIcon />
          </span>
        </LoginModalTrigger>
      )}
      {isUserLogged && (
        <Link to="/account" className="btn gap-2 btn-accent btn-outline mx-4">
          Select topic to follow
          <PlusIcon />
        </Link>
      )}
    </nav>
  );
};

export default CategoryNav;
