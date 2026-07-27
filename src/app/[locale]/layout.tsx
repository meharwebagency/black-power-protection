import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { Agentation } from "agentation";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { isValidLocale, getDirection } from "@/i18n/config";
import type { Locale } from "@/types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const direction = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              name: "White Horse",
              alternateName: "الحصان الأبيض",
              description: "Premium luxury car marketplace in Kuwait",
              url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              telephone: "+96566466100",
              sameAs: [],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "09:00",
                closes: "22:00",
              },
              priceRange: "$$$$",
              areaServed: {
                "@type": "Country",
                name: "Kuwait",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased" dir={direction}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
