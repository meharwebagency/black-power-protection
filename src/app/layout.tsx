import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "White Horse | Premium Luxury Car Marketplace in Kuwait",
    template: "%s | White Horse",
  },
  description:
    "Discover the finest luxury and premium cars in Kuwait. A distinguished car market from White Horse.",
  keywords: ["luxury cars", "used cars", "Kuwait", "White Horse", "premium vehicles", "سيارات فاخرة", "كويت"],
  authors: [{ name: "White Horse" }],
  creator: "White Horse",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ar_KW",
    alternateLocale: "en_US",
    siteName: "White Horse",
    title: "White Horse | Premium Luxury Car Marketplace in Kuwait",
    description: "Discover the finest luxury and premium cars in Kuwait.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "White Horse - Luxury Cars Kuwait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "White Horse | Premium Luxury Car Marketplace in Kuwait",
    description: "Discover the finest luxury and premium cars in Kuwait.",
    images: ["/og-image.jpg"],
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
  alternates: {
    languages: {
      "ar": "/ar",
      "en": "/en",
    },
  },
};

// The single <html>/<body> document is rendered by src/app/[locale]/layout.tsx
// so it can set the correct lang/dir per locale. This root layout is a
// pass-through: root-level routes (page.tsx, not-found.tsx) only redirect and
// render no body, so no document wrapper is needed here. Rendering a second
// <html>/<body> here was the source of the hydration mismatch.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
