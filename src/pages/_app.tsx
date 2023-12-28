import Header from '@/components/header/Header';
import DefaultLayout from '@/components/layout/DefaultLayout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DefaultLayout>
      <Header />
      <Component {...pageProps} />
    </DefaultLayout>
  );
}
