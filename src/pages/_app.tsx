import Header from '@/components/Header';
import ContentLayout from '@/layout/ContentLayout';
import OverallLayout from '@/layout/OverallLayout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

// TODO: 레이아웃 Comp 증가 or 페이지 마다 다른 레이아웃이 필요한 경우 getLayout 함수를 통해 레이아웃을 가져오는 방식으로 변경
export default function App({ Component, pageProps }: AppProps) {
  return (
    <OverallLayout>
      <Header />
      <ContentLayout>
        <Component {...pageProps} />
      </ContentLayout>
    </OverallLayout>
  );
}
