"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Sun, Moon, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { NAV_LINKS, CONTACT_INFO, LOGO_URL } from "@/lib/constants";
import { easings } from "@/lib/motion";
import type { Locale } from "@/types";

interface HeaderProps {
  locale: Locale;
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
    };
  };
  onToggleTheme: () => void;
  isDark: boolean;
}

export function Header({ locale, dictionary, onToggleTheme, isDark }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLElement>(null);

  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  /* Single scroll system — one listener, one threshold */
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close drawer on navigation */
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Close drawer when viewport grows past the mobile breakpoint
     (prevents the body scroll-lock from leaking on resize) */
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Body scroll lock */
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Escape to close + move focus into the dialog, restore on close */
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const frame = requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
      toggleRef.current?.focus();
    };
  }, [mobileOpen]);

  /* Minimal focus trap for the drawer */
  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /* Anchored locale swap — only replaces the leading segment */
  const otherLocale: Locale = isAr ? "en" : "ar";
  const otherLocalePath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${otherLocale}`) ||
    `/${otherLocale}`;

  const homeHref = `/${locale}`;

  /* Contact lives in the CTA — drop it from the inline nav to keep one action */
  const inlineNavLinks = NAV_LINKS.filter((link) => link.href !== "/contact");

  const isLinkActive = (href: string) => {
    const full = href === "/" ? homeHref : `${homeHref}${href}`;
    return href === "/"
      ? pathname === full
      : pathname === full || pathname.startsWith(`${full}/`);
  };

  const hrefFor = (href: string) => (href === "/" ? homeHref : `${homeHref}${href}`);

  const themeLabel = isDark
    ? t("التبديل إلى الوضع الفاتح", "Switch to light mode")
    : t("التبديل إلى الوضع الداكن", "Switch to dark mode");

  const drawerTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: easings.luxury };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
          scrolled ? "border-border/60" : "border-transparent"
        )}
      >
        {/* Glass surface — fades in with the same threshold as the border */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 glass-panel transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />

        <Container size="xl">
          <div
            className={cn(
              "relative flex items-center justify-between",
              "transition-[height] duration-500 ease-luxury",
              scrolled ? "h-14 md:h-16" : "h-18 md:h-20"
            )}
          >
            {/* Logo */}
            <Link
              href={homeHref}
              className="group flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              aria-label={dictionary.common.appName}
            >
              <img
                src={LOGO_URL}
                alt=""
                width={40}
                height={40}
                loading="eager"
                className={cn(
                  "shrink-0 rounded-full object-cover transition-all duration-500 ease-luxury",
                  scrolled ? "h-8 w-8" : "h-9 w-9 md:h-10 md:w-10"
                )}
              />
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className={cn(
                    "truncate font-display font-semibold text-foreground",
                    "text-sm md:text-base",
                    !isAr && "uppercase tracking-[0.14em]"
                  )}
                >
                  {t("بلاك باور", "Black Power")}
                </span>
                <span
                  className={cn(
                    "truncate text-[0.625rem] text-muted-foreground",
                    "mt-1",
                    !isAr && "uppercase tracking-[0.3em]"
                  )}
                >
                  {t("بروتكشن", "Protection")}
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label={t("التنقل الرئيسي", "Main navigation")}
              className="absolute start-1/2 hidden -translate-x-1/2 rtl:translate-x-1/2 md:block"
            >
              <ul className="flex items-center gap-1">
                {inlineNavLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <li key={link.href} className="relative">
                      <Link
                        href={hrefFor(link.href)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative block px-4 py-2.5 transition-colors duration-300",
                          isAr
                            ? "text-sm font-medium"
                            : "text-[0.8125rem] font-medium uppercase tracking-[0.08em]",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                        )}
                      >
                        {isAr ? link.labelAr : link.label}
                        {/* The single gold element: active hairline */}
                        {active && (
                          <motion.span
                            layoutId="header-nav-indicator"
                            aria-hidden="true"
                            className="absolute inset-x-4 -bottom-px h-px bg-accent"
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 350, damping: 35 }
                            }
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 md:gap-1">
              {/* Search — pre-filtered browse entry, not a crutch */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-lg text-muted-foreground hover:text-foreground"
              >
                <Link
                  href={`/${locale}/vehicles`}
                  aria-label={t("البحث في السيارات", "Search vehicles")}
                >
                  <Search className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                </Link>
              </Button>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                aria-label={themeLabel}
                suppressHydrationWarning
                className="relative hidden rounded-lg text-muted-foreground hover:text-foreground md:inline-flex"
              >
                <Sun
                  strokeWidth={1.75}
                  className="h-[1.125rem] w-[1.125rem] rotate-0 scale-100 transition-all duration-500 ease-luxury dark:-rotate-90 dark:scale-0"
                />
                <Moon
                  strokeWidth={1.75}
                  className="absolute h-[1.125rem] w-[1.125rem] rotate-90 scale-0 transition-all duration-500 ease-luxury dark:rotate-0 dark:scale-100"
                />
              </Button>

              {/* Language — explicit target language, not an ambiguous globe */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-lg px-3 text-muted-foreground hover:text-foreground md:inline-flex"
              >
                <Link
                  href={otherLocalePath}
                  lang={otherLocale}
                  hrefLang={otherLocale}
                  aria-label={dictionary.nav.languageLabel}
                >
                  <span
                    className={cn(
                      otherLocale === "en" &&
                        "text-[0.75rem] uppercase tracking-[0.08em]",
                      otherLocale === "ar" && "text-sm"
                    )}
                  >
                    {dictionary.nav.switchLanguage}
                  </span>
                </Link>
              </Button>

              {/* Single solid CTA */}
              <Button
                asChild
                variant="primary"
                size="sm"
                className="ms-2 hidden rounded-lg px-4 md:inline-flex"
              >
                <Link href={`/${locale}/contact`}>
                  {t("اتصل بنا", "Contact Us")}
                </Link>
              </Button>

              {/* Mobile menu toggle */}
              <Button
                ref={toggleRef}
                variant="ghost"
                size="icon"
                className="rounded-lg md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label={dictionary.nav.openMenu}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-haspopup="dialog"
              >
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
              }
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel — slides in from the end edge in both directions */}
            <motion.nav
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={dictionary.nav.menu}
              tabIndex={-1}
              onKeyDown={trapFocus}
              initial={{ x: isAr ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? "-100%" : "100%" }}
              transition={drawerTransition}
              className="absolute inset-y-0 end-0 flex w-[85%] max-w-xs flex-col border-s border-border bg-background outline-none"
            >
              {/* Drawer header */}
              <div className="flex h-18 shrink-0 items-center justify-between border-b border-border/60 px-5">
                <span
                  className={cn(
                    "font-display text-sm font-semibold text-foreground",
                    !isAr && "uppercase tracking-[0.14em]"
                  )}
                >
                  {t("بلاك باور", "Black Power")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => setMobileOpen(false)}
                  aria-label={dictionary.nav.closeMenu}
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </Button>
              </div>

              {/* Links */}
              <ul className="flex-1 overflow-y-auto px-3 py-6">
                {NAV_LINKS.map((link, index) => {
                  const active = isLinkActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { delay: 0.05 + index * 0.05, duration: 0.35 }
                      }
                    >
                      <Link
                        href={hrefFor(link.href)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative block rounded-lg px-4 py-3.5 text-base transition-colors duration-300",
                          active
                            ? "font-medium text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-3 start-0 w-px bg-accent"
                          />
                        )}
                        {isAr ? link.labelAr : link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Drawer footer: preferences + contact */}
              <div className="shrink-0 space-y-4 border-t border-border/60 px-5 py-5">
                <div className="flex items-center justify-between">
                  {/* Theme */}
                  <button
                    onClick={onToggleTheme}
                    aria-label={themeLabel}
                    suppressHydrationWarning
                    className="flex items-center gap-2.5 rounded-lg py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="relative inline-flex h-[1.125rem] w-[1.125rem]">
                      <Sun
                        strokeWidth={1.75}
                        className="absolute inset-0 h-full w-full scale-100 transition-all duration-500 dark:scale-0"
                      />
                      <Moon
                        strokeWidth={1.75}
                        className="absolute inset-0 h-full w-full scale-0 transition-all duration-500 dark:scale-100"
                      />
                    </span>
                    {t("المظهر", "Appearance")}
                  </button>

                  {/* Language */}
                  <Link
                    href={otherLocalePath}
                    lang={otherLocale}
                    hrefLang={otherLocale}
                    aria-label={dictionary.nav.languageLabel}
                    className={cn(
                      "rounded-lg py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      otherLocale === "en"
                        ? "text-[0.75rem] uppercase tracking-[0.08em]"
                        : "text-sm"
                    )}
                  >
                    {dictionary.nav.switchLanguage}
                  </Link>
                </div>

                {/* Click-to-call — primary conversion path in this market */}
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center gap-2.5 rounded-lg py-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.75} />
                  <span dir="ltr">{CONTACT_INFO.phoneFormatted}</span>
                </a>

                <Button asChild variant="primary" fullWidth size="lg" className="rounded-xl">
                  <Link href={`/${locale}/contact`}>
                    {t("اتصل بنا", "Contact Us")}
                  </Link>
                </Button>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
