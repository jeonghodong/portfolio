import { ReactNode } from 'react';

interface OverallLayoutProps {
  children: ReactNode;
}

const OverallLayout = ({ children }: OverallLayoutProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-[1900px] min-w-[300px] h-[100%]">{children}</div>
    </div>
  );
};

export default OverallLayout;
