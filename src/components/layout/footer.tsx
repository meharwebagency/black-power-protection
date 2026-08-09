"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { CONTACT_INFO, SOCIAL_LINKS, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Twitter, Facebook, Phone, Mail } from "lucide-react";
import type { Locale } from "@/types";

interface FooterProps {
  locale: Locale;
  dictionary: {
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
    common: {
      appName: string;
    };
  };
}

export function Footer({ locale, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-secondary/30">
      {/* Decorative top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 md:py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} className="group inline-block">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className={cn(
                    "font-display text-xl text-foreground transition-colors group-hover:text-primary",
                    locale === "ar" ? "font-bold" : "font-medium"
                  )}>
                    {locale === "ar" ? "ديمو موقع بيع السيارات" : "Demo of Car Selling Website"}
                  </span>
                </div>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-body-sm leading-relaxed text-muted-foreground text-pretty">
              {dictionary.footer.description}
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-2">
              {[
                SOCIAL_LINKS.twitter ? { href: SOCIAL_LINKS.twitter, icon: Twitter, label: "Twitter" } : null,
                SOCIAL_LINKS.facebook ? { href: SOCIAL_LINKS.facebook, icon: Facebook, label: "Facebook" } : null,
              ].filter(Boolean).map((item) => item && (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-elevated"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-label-md uppercase tracking-wider text-foreground">
              {dictionary.footer.quickLinks}
            </h3>
            <nav className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="text-body-sm text-muted-foreground transition-colors duration-200 hover:text-gold-600 dark:hover:text-gold-400"
                >
                  {locale === "ar" ? link.labelAr : link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-label-md uppercase tracking-wider text-foreground">
              {dictionary.footer.contactUs}
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-3 text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold-600 dark:text-gold-400" />
                {CONTACT_INFO.phoneFormatted}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold-600 dark:text-gold-400" />
                <span className="break-all">{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-label-md uppercase tracking-wider text-foreground">
              {dictionary.contact.workingHours}
            </h3>
            <p className="text-body-sm text-muted-foreground">
              {locale === "ar" ? CONTACT_INFO.workingHoursAr : CONTACT_INFO.workingHours}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-body-xs text-muted-foreground">
            &copy; {currentYear} {dictionary.common.appName}. {dictionary.footer.rights}.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/privacy`}
              className="text-body-xs text-muted-foreground transition-colors hover:text-gold-600 dark:hover:text-gold-400"
            >
              {dictionary.footer.privacyPolicy}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-body-xs text-muted-foreground transition-colors hover:text-gold-600 dark:hover:text-gold-400"
            >
              {dictionary.footer.termsOfUse}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
