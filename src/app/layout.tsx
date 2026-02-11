import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Google Search Console Verification
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://petbusan.com";

export const metadata: Metadata = {
  title: {
    default: "펫부산 | 반려동물 용품 리뷰와 비용 분석",
    template: "%s | 펫부산",
  },
  description:
    "반려동물 용품의 성능, TCO(총소유비용), 소모품 비용을 비교 분석합니다. 자동 화장실, 급수기, 급식기 등 반려동물 용품 리뷰와 비용 가이드.",
  keywords: ["반려동물 용품", "펫용품 리뷰", "반려동물 용품 비교", "펫용품 비용", "반려동물 TCO"],
  authors: [{ name: "펫부산" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "펫부산",
    title: "펫부산 | 반려동물 용품 리뷰와 비용 분석",
    description:
      "반려동물 용품의 성능, TCO(총소유비용), 소모품 비용을 비교 분석합니다.",
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
  verification: {
    google: "LSMgI6XAKsLBkM8WlWKnKWP_z6NUMGAycz6L-xamusw",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ko-KR": siteUrl,
      "x-default": siteUrl,
    },
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
};

// JSON-LD WebSite Schema with SearchAction
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "펫부산",
  alternateName: "PetBusan",
  url: siteUrl,
  description: "반려동물 용품의 성능, TCO(총소유비용), 소모품 비용을 비교 분석합니다.",
  inLanguage: "ko-KR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// JSON-LD Organization Schema
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "펫부산",
  alternateName: "PetBusan",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: "반려동물 용품 리뷰와 비용 분석 블로그",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Korean"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* JSON-LD WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${notoSansKr.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
