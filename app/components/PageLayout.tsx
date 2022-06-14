import { FC, ReactNode } from 'react';
import { Link, NavLink } from '@remix-run/react';
import { User } from '~/lib/session.server';
import LoginModalTrigger from '~/components/LoginModalTrigger';
import LoginModal from '~/components/LoginModal';
import Logo from '~/components/icons/Logo';
import ThemeSwitch from '~/components/ThemeSwith';

interface PageLayoutProps {
  children: ReactNode;
  user: User;
  hideSidebar?: boolean;
}

const PageLayout: FC<PageLayoutProps> = ({ children, hideSidebar, user }) => {
  return (
    <div className="flex flex-col w-full border-opacity-50 base-300 min-h-screen">
      <div className="flex justify-between items-center px-6 py-5">
        <Link to="/">
          <div className="w-52 text-accent">
            <Logo />
          </div>
        </Link>
        <div className="flex">
          <ThemeSwitch />
          {!user ? (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          ) : (
            <div className="flex items-center">
              <span className="mr-3">{`Hi ${user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="btn btn-primary">
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <div className="divider m-0 h-0" />
      <div className="flex w-full">
        {!hideSidebar ? (
          <>
            <div className="w-2/12 relative">
              <div className="sticky top-0 h-screen w-full px-3 py-5">
                <NavLink
                  to="/"
                  prefetch="render"
                  className={({ isActive }) =>
                    `btn ${
                      isActive ? 'btn-secondary' : 'btn-ghost'
                    } w-full justify-start`
                  }
                >
                  All news
                </NavLink>
                {user && (
                  <NavLink
                    to="/bookmarks"
                    className={({ isActive }) =>
                      `btn ${
                        isActive ? 'btn-secondary' : 'btn-ghost'
                      } w-full justify-start`
                    }
                  >
                    Bookmarks
                  </NavLink>
                )}
                {user && (
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      `btn ${
                        isActive ? 'btn-secondary' : 'btn-ghost'
                      } w-full justify-start`
                    }
                  >
                    Account
                  </NavLink>
                )}
                {!user && (
                  <LoginModalTrigger id="login">
                    <span className="btn btn-ghost w-full justify-start">
                      Bookmarks
                    </span>
                  </LoginModalTrigger>
                )}
              </div>
            </div>
            <div className="divider divider-horizontal m-0 w-0" />
            <div className="flex w-10/12 base-200">
              <div className="p-8 w-full">{children}</div>
            </div>
          </>
        ) : (
          <div className="p-8 w-full">{children}</div>
        )}
      </div>
      <LoginModal id="login" />
    </div>
  );
};

export default PageLayout;
