import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "@/src/styles/globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";

const GA_TRACKING_ID = "G-9PXZHVPLP7";
const SITE_URL = "https://portfolio.jeonghodong.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jeongho Dong - Product Engineer & Frontend Developer",
    template: "%s | Jeongho Dong",
  },
  description:
    "I connect tech to impact. Interactive 3D portfolio showcasing web development projects and skills. Frontend Developer specializing in React, Next.js, and Three.js.",
  keywords: [
    "Frontend Developer",
    "Product Engineer",
    "React",
    "Next.js",
    "Three.js",
    "TypeScript",
    "Portfolio",
    "Web Developer",
    "3D Web",
  ],
  authors: [{ name: "Jeongho Dong" }],
  creator: "Jeongho Dong",

  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
      "en-US": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "Jeongho Dong Portfolio",
    title: "Jeongho Dong - Product Engineer & Frontend Developer",
    description:
      "I connect tech to impact. Interactive 3D portfolio showcasing web development projects and skills.",
    images: [
      {
        url: "/open-graph/image.png",
        width: 1200,
        height: 630,
        alt: "Jeongho Dong Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jeongho Dong - Product Engineer & Frontend Developer",
    description:
      "I connect tech to impact. Interactive 3D portfolio showcasing web development projects and skills.",
    images: ["/open-graph/image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "32x32" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-icon-180x180.png", sizes: "180x180" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Jeongho Dong Portfolio",
      description:
        "I connect tech to impact. Interactive 3D portfolio showcasing web development projects and skills.",
      inLanguage: ["ko-KR", "en-US"],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Jeongho Dong",
      alternateName: "동정호",
      jobTitle: "Product Engineer & Frontend Developer",
      url: SITE_URL,
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Three.js",
        "Frontend Development",
        "Web Development",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Jeongho Dong - Product Engineer & Frontend Developer Portfolio",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      description:
        "I connect tech to impact. Interactive 3D portfolio showcasing web development projects and skills.",
      inLanguage: ["ko-KR", "en-US"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
