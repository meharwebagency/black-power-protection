"use client";

import { useTheme } from "next-themes";
import { Header } from "./header";
import { Footer } from "./footer";
import { ToastProvider } from "@/components/ui/toast";
import type { Locale } from "@/types";

interface MainLayoutProps {
  locale: Locale;
  children: React.ReactNode;
  dictionary: {
    nav: {
      menu: string;
      openMenu: string;
      closeMenu: string;
      switchLanguage: string;
      languageLabel: string;
    };
    common: {
      appName: string;
      home: string;
      vehicles: string;
      about: string;
      contact: string;
    };
    footer: {
      description: string;
      quickLinks: string;
      contactUs: string;
      followUs: string;
      rights: string;
      privacyPolicy: string;
      termsOfUse: string;
    };
    contact: {
      phone: string;
      email: string;
      address: string;
      workingHours: string;
    };
  };
}

export function MainLayout({ locale, children, dictionary }: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        {/* Skip to content - accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-elevated-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
        >
          {locale === "ar" ? "تخطي إلى المحتوى" : "Skip to content"}
        </a>

        <Header
          locale={locale}
          dictionary={dictionary}
          onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
          isDark={isDark}
        />
        <main id="main-content" className="flex-1 pt-18 md:pt-20 scroll-mt-20">{children}</main>
        <Footer locale={locale} dictionary={dictionary} />
      </div>
    </ToastProvider>
  );
}
