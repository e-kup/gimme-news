import { useState, FC } from 'react';
import LoginModalTrigger from '~/components/LoginModalTrigger';
import BookmarkIcon from '~/components/icons/Bookmark';
import StoredBookmarkIcon from '~/components/icons/StoredBookmark';

interface CardProps {
  url: string;
  image: string;
  title: string;
  description: string;
  publicationDate: string;
  userId?: string;
}

const ArticleCard: FC<CardProps> = ({
  url,
  image,
  title,
  description,
  publicationDate,
  userId,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const onBookmarkChange = () => {
    setIsBookmarked((is) => !is);
  };
  return (
    <a href={url}>
      <div className="card h-full bg-base-100 shadow-xl bg-gray-800">
        <figure>
          <img src={image} aria-hidden="true" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="text-sm">{publicationDate}</p>
          <p>{description}</p>
          <div className="card-actions justify-end">
            {userId ? (
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
                  <div className="swap-on">
                    <StoredBookmarkIcon />
                  </div>
                  <div className="swap-off">
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
