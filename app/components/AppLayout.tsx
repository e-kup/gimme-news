import React, { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full border-opacity-50">
      <h4 className="text-xl font-bold font-poppins px-3 py-5">Gimme news</h4>
      <div className="divider m-0 h-0" />
      <div className="flex w-full">
        <div className="w-2/12 relative">
          <div className="sticky top-0 h-screen w-full px-3 py-5">nav</div>
        </div>
        <div className="divider divider-horizontal  m-0 w-0" />
        <div className="flex w-10/12 ">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
