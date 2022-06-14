import { useState, FC } from 'react';
import LoginModalTrigger from '~/components/LoginModalTrigger';
import BookmarkIcon from '~/components/icons/Bookmark';
import StoredBookmarkIcon from '~/components/icons/StoredBookmark';
import { Form, useSubmit, useTransition } from '@remix-run/react';

interface CardProps {
  id: string;
  url: string;
  image: string;
  title: string;
  description: string;
  publicationDate: string;
  userId?: string;
  bookmarked: boolean;
  onChange: (bookmark: boolean) => void;
}

const ArticleCard: FC<CardProps> = ({
  id,
  url,
  image,
  title,
  description,
  publicationDate,
  userId,
  bookmarked,
  onChange,
}) => {
  // const [bookmarked, setIsBookmarked] = useState(bookmarked);
  const { state } = useTransition();
  // eslint-disable-next-line
  console.log(state);
  const onBookmarkChange = () => {
    onChange(!bookmarked);
  };
  return (
    <a href={url}>
      <div className="card h-full bg-base-100 shadow-xl bg-gray-800">
        <figure>
          <img src={image} aria-hidden="true" />
        </figure>
        <div className="card-body">
          <div className="badge badge-ghost p-0">{publicationDate}</div>
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end">
            {userId ? (
              <div
                className="tooltip tooltip-left"
                data-tip={
                  bookmarked ? 'remove from bookmarks' : 'add to bookmarks'
                }
              >
                <label className="swap swap-flip text-9xl">
                  <input
                    type="checkbox"
                    checked={bookmarked || state === 'submitting'}
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
              <LoginModalTrigger id={'login'}>
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
