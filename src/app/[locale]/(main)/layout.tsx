import { getDictionary } from "@/i18n/get-dictionary";
import { MainLayout } from "@/components/layout/main-layout";
import type { Locale } from "@/types";

interface MainGroupLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function MainGroupLayout({ children, params }: MainGroupLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <MainLayout locale={locale} dictionary={dictionary}>
      {children}
    </MainLayout>
  );
}
