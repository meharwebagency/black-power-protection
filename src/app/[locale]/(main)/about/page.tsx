"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Award,
  Headphones,
  Trophy,
  Users,
  Car,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import type { Locale } from "@/types";

interface AboutPageProps {
  params: Promise<{ locale: Locale }>;
}

const STATS = [
  { icon: Calendar, valueAr: "+10", valueEn: "+10", labelAr: "سنوات الخبرة", labelEn: "Years of Experience" },
  { icon: Car, valueAr: "+500", valueEn: "+500", labelAr: "سيارة تم بيعها", labelEn: "Cars Sold" },
  { icon: Users, valueAr: "+300", valueEn: "+300", labelAr: "عميل سعيد", labelEn: "Happy Clients" },
  { icon: Trophy, valueAr: "+20", valueEn: "+20", labelAr: "ماركة عالمية", labelEn: "Global Brands" },
];

const VALUES = [
  {
    icon: Shield,
    titleAr: "الجودة",
    titleEn: "Quality",
    descAr: "كل سيارة تمر بفحص 150 نقطة قبل العرض لضمان أعلى معايير الجودة",
    descEn: "Every car undergoes a 150-point inspection before listing to ensure the highest quality standards",
  },
  {
    icon: Award,
    titleAr: "الثقة",
    titleEn: "Trust",
    descAr: "شفافية تامة في كل تعاملاتنا، مع معلومات مفصلة عن كل سيارة",
    descEn: "Complete transparency in all our dealings, with detailed information about every vehicle",
  },
  {
    icon: Headphones,
    titleAr: "خدمة العملاء",
    titleEn: "Customer Service",
    descAr: "فريق متخصص جاهز لمساعدتك في أي وقت عبر واتساب أو الهاتف",
    descEn: "A dedicated team ready to assist you anytime via WhatsApp or phone",
  },
  {
    icon: Trophy,
    titleAr: "التميز",
    titleEn: "Excellence",
    descAr: "نسعى دائماً لتقديم تجربة استثنائية تفوق توقعات عملائنا",
    descEn: "We always strive to deliver an exceptional experience that exceeds our clients' expectations",
  },
];

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/50" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -end-40 h-[500px] w-[500px] rounded-full bg-gold-400/5 blur-3xl" />
          <div className="absolute -bottom-40 -start-40 h-[500px] w-[500px] rounded-full bg-gold-400/5 blur-3xl" />
        </div>
        <div className="absolute inset-0 grid-lines opacity-20" />

        <Container className="relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-gold-500" />
              <span className="text-label-sm uppercase tracking-wider text-gold-600 dark:text-gold-400">
                {isArabic ? "من نحن" : "About Us"}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className={cn(
                "font-display text-display-sm md:text-display-lg text-foreground",
                isArabic ? "font-bold" : "font-medium"
              )}
            >
              {isArabic ? "ديمو موقع بيع السيارات" : "Demo of Car Selling Website"}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-body-lg md:text-body-xl text-muted-foreground"
            >
              {isArabic
                ? "خبراء في عالم السيارات الفاخرة في الكويت"
                : "Experts in Kuwait's Luxury Car Market"}
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Gold divider */}
      <div className="relative py-2">
        <div className="mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </div>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
          >
            {/* Text */}
            <motion.div variants={fadeUp}>
              <span className="mb-3 block text-label-md uppercase tracking-wider text-gold-600 dark:text-gold-400">
                {isArabic ? "قصتنا" : "Our Story"}
              </span>
              <h2 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
                {isArabic
                  ? "أكثر من 10 سنوات من الخبرة"
                  : "Over 10 Years of Experience"}
              </h2>
              <p className="mt-4 text-body-md leading-relaxed text-muted-foreground">
                {isArabic
                  ? "تأسس ديمو موقع بيع السيارات ليكون الوجهة الأولى لعشاق السيارات الفاخرة في الكويت. نؤمن بأن كل عميل يستحق أفضل تجربة عند البحث عن سيارته المثالية."
                  : "Demo of Car Selling Website was founded to be the premier destination for luxury car enthusiasts in Kuwait. We believe every client deserves the best experience when searching for their perfect vehicle."}
              </p>
              <p className="mt-4 text-body-md leading-relaxed text-muted-foreground">
                {isArabic
                  ? "مع أكثر من 10 سنوات من الخبرة في سوق السيارات الفاخرة، نقدم مجموعة حصرية من أرقى الماركات العالمية مع ضمان الجودة والشفافية الكاملة في كل تعاملاتنا."
                  : "With over 10 years of experience in the luxury car market, we offer an exclusive collection of the world's finest brands with guaranteed quality and complete transparency in all our dealings."}
              </p>
            </motion.div>

            {/* Logo card */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <div className="relative flex aspect-square w-full max-w-[256px] items-center justify-center rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary p-6 sm:p-8 ring-1 ring-border">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold-400/5 to-transparent" />
                <span className={cn(
                  "relative font-display text-display-sm md:text-display-md text-foreground",
                  isArabic ? "font-bold" : "font-medium"
                )}>
                  {isArabic ? "ديمو موقع بيع السيارات" : "Demo of Car Selling Website"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-secondary/30 py-16 md:py-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {STATS.map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="text-center transition-shadow hover:shadow-elevated">
                  <CardContent className="flex flex-col items-center p-4 sm:p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400/10">
                      <stat.icon className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                    </div>
                    <p className="font-display text-display-xs font-bold text-foreground">
                      {isArabic ? stat.valueAr : stat.valueEn}
                    </p>
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      {isArabic ? stat.labelAr : stat.labelEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div variants={fadeUp}>
              <span className="mb-3 block text-label-md uppercase tracking-wider text-gold-600 dark:text-gold-400">
                {isArabic ? "مهمتنا" : "Our Mission"}
              </span>
              <h2 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
                {isArabic
                  ? "نكون الخيار الأول"
                  : "Being the First Choice"}
              </h2>
              <p className="mt-4 text-body-lg leading-relaxed text-muted-foreground">
                {isArabic
                  ? "أن نكون الخيار الأول لعملائنا في الكويت عندما يبحثون عن سيارة فاخرة تجمع بين الأناقة والأداء والقيمة."
                  : "To be the first choice for our clients in Kuwait when searching for a luxury car that combines elegance, performance, and value."}
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Gold divider */}
      <div className="relative py-2">
        <div className="mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </div>

      {/* Values */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="mb-10 text-center">
              <span className="mb-3 block text-label-md uppercase tracking-wider text-gold-600 dark:text-gold-400">
                {isArabic ? "قيمنا" : "Our Values"}
              </span>
              <h2 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
                {isArabic ? "ما يميزنا" : "What Sets Us Apart"}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                    <CardContent className="flex flex-col p-4 sm:p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-body-lg font-semibold text-foreground">
                        {isArabic ? value.titleAr : value.titleEn}
                      </h3>
                      <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                        {isArabic ? value.descAr : value.descEn}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground to-foreground/90 p-6 text-center sm:p-8 md:p-12"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
              <div className="absolute -bottom-20 -start-20 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
            </div>

            <motion.div variants={fadeUp} className="relative z-10">
              <h2 className="font-display text-display-xs md:text-display-sm font-bold text-background">
                {isArabic
                  ? "هل أنت مستعد لإيجاد سيارتك المثالية؟"
                  : "Ready to Find Your Perfect Car?"}
              </h2>
              <p className="mt-3 text-body-md text-background/70">
                {isArabic
                  ? "تصفح مجموعتنا الحصرية من السيارات الفاخرة"
                  : "Browse our exclusive collection of luxury vehicles"}
              </p>
              <Link href={`/${locale}/vehicles`} className="mt-6 inline-block">
                <Button variant="gold" size="lg">
                  {isArabic ? "تصفح المجموعة" : "Browse Collection"}
                  {isArabic ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <WhatsAppButton locale={locale} />
      <ScrollToTop />
    </div>
  );
}
