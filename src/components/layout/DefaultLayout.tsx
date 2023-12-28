import { ReactNode } from 'react';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-[1900px] h-[100%]">{children}</div>
    </div>
  );
};

export default DefaultLayout;
