import { NavLink } from '@remix-run/react';
import type { FC } from 'react';

interface CategoryLinkProps {
  url: string;
}

const CategoryLink: FC<CategoryLinkProps> = ({ children, url }) => {
  const commonClassName = 'link mx-4';
  return (
    <NavLink
      to={url}
      prefetch="render"
      className={({ isActive }) =>
        isActive
          ? `${commonClassName} link-secondary`
          : `${commonClassName} link-accent`
      }
    >
      {children}
    </NavLink>
  );
};

export default CategoryLink;
