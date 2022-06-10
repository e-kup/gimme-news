import { ChangeEvent, useState } from 'react';

interface CardProps {
  url: string;
  image: string;
  title: string;
  description: string;
}

const bookmark = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const storedBookmark = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    />
  </svg>
);

const ArticleCard: React.FC<CardProps> = ({
  url,
  image,
  title,
  description,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const onBookmarkChange = (e: ChangeEvent) => {
    e.stopPropagation();
    setIsBookmarked((is) => !is);
  };
  return (
    <a href={url}>
      <div className="card h-full bg-base-100 shadow-xl">
        <figure>
          <img src={image} aria-hidden="true" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end">
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
                <div className="swap-on">{storedBookmark}</div>
                <div className="swap-off">{bookmark}</div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;
