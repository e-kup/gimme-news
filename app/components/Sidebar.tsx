import React from 'react';
import { NavLink } from '@remix-run/react';
import LoginModalTrigger from '~/components/LoginModalTrigger';

interface SidebarProps {
  isUserLogged: boolean;
}

const activeClass = 'btn btn-secondary w-full justify-start';
const inactiveClass = 'btn btn-ghost w-full justify-start';

const getNavClassName = (isActive: boolean): string => {
  return isActive ? activeClass : inactiveClass;
};

const Sidebar: React.FC<SidebarProps> = ({ isUserLogged }) => {
  return (
    <div className="sticky top-0 h-screen w-full px-3 py-5">
      <NavLink
        to="/"
        prefetch="render"
        className={({ isActive }) => getNavClassName(isActive)}
      >
        All news
      </NavLink>
      {isUserLogged && (
        <NavLink
          to="/bookmarks"
          className={({ isActive }) => getNavClassName(isActive)}
        >
          Bookmarks
        </NavLink>
      )}
      {isUserLogged && (
        <NavLink
          to="/account"
          className={({ isActive }) => getNavClassName(isActive)}
        >
          Account
        </NavLink>
      )}
      {!isUserLogged && (
        <LoginModalTrigger id="login">
          <span className={inactiveClass}>Bookmarks</span>
        </LoginModalTrigger>
      )}
    </div>
  );
};

export default Sidebar;
