import { ReactNode } from 'react';

interface ContentLayoutProps {
  children: ReactNode;
}

const ContentLayout = ({ children }: ContentLayoutProps) => {
  return <div className="z-[-100] px-[25px] lg:px-[100px] flex justify-center">{children}</div>;
};

export default ContentLayout;
