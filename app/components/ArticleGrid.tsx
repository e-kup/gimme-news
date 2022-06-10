import React, { ReactNode } from 'react';

interface ArticleGridProps {
  children: ReactNode[];
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
      {children}
    </div>
  );
};

export default ArticleGrid;
