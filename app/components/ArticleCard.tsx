import type { FC } from 'react';
import { useState } from 'react';
import LoginModalTrigger from '~/components/LoginModalTrigger';
import BookmarkIcon from '~/components/icons/Bookmark';
import StoredBookmarkIcon from '~/components/icons/StoredBookmark';

interface CardProps {
  url: string;
  image: string;
  title: string;
  description: string;
  publicationDate: string;
  isUserLogged: boolean;
  bookmarked: boolean;
  onChange: (bookmark: boolean) => void;
}

const ArticleCard: FC<CardProps> = ({
  url,
  image,
  title,
  description,
  publicationDate,
  isUserLogged,
  bookmarked,
  onChange,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const onBookmarkChange = () => {
    onChange(!isBookmarked);
    setIsBookmarked((is) => !is);
  };
  return (
    <a href={url}>
      <div className="card rounded-none h-full border border-primary bg-base-100 base-200">
        <figure className="max-h-52 overflow-hidden">
          <img src={image} aria-hidden="true" alt={title} />
        </figure>
        <div className="card-body">
          <div className="badge badge-ghost">{publicationDate}</div>
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end">
            {isUserLogged ? (
              <div
                className="tooltip tooltip-left"
                data-tip={
                  isBookmarked ? 'remove from bookmarks' : 'add to bookmarks'
                }
              >
                <label className="swap swap-flip text-9xl">
                  <input
                    type="checkbox"
                    checked={isBookmarked}
                    onChange={onBookmarkChange}
                  />
                  <div className="swap-on text-secondary hover:text-inherit">
                    <StoredBookmarkIcon />
                  </div>
                  <div className="swap-off hover:text-secondary">
                    <BookmarkIcon />
                  </div>
                </label>
              </div>
            ) : (
              <LoginModalTrigger id="login">
                <div
                  className="tooltip tooltip-left"
                  data-tip="add to bookmarks"
                >
                  <div className="swap-off">
                    <BookmarkIcon />
                  </div>
                </div>
              </LoginModalTrigger>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;
