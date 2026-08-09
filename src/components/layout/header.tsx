"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { NAV_LINKS, CONTACT_INFO } from "@/lib/constants";
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
}

export function Header({ locale, dictionary }: HeaderProps) {
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

  const drawerTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: easings.luxury };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b bg-[#000000] border-white/[0.08]",
          "shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-colors duration-200"
        )}
      >
        <Container size="xl">
          <div
            className={cn(
              "relative flex items-center justify-between",
              "h-18 md:h-20"
            )}
          >
            {/* Logo */}
            <Link
              href={homeHref}
              className="group flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              aria-label={dictionary.common.appName}
            >
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className={cn(
                    "font-display text-white transition-colors duration-200",
                    "text-base",
                    isAr ? "font-bold" : "font-medium"
                  )}
                >
                    {t("ديمو موقع بيع السيارات", "Demo of Car Selling Website")}
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
                          "relative block px-4 py-2.5 transition-colors duration-200",
                          isAr
                            ? "text-sm font-medium"
                            : "text-body-sm font-medium uppercase tracking-[0.08em]",
                          active
                            ? "text-white"
                            : "text-white/70 hover:text-gold-400",
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
                className="rounded-lg text-white transition-colors duration-200 hover:bg-white/10 hover:text-gold-400"
              >
                <Link
                  href={`/${locale}/vehicles`}
                  aria-label={t("البحث في السيارات", "Search vehicles")}
                >
                  <Search className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                </Link>
              </Button>

              {/* Language — explicit target language, not an ambiguous globe */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-lg px-3 text-white transition-colors duration-200 hover:bg-white/10 hover:text-gold-400 md:inline-flex"
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
                        "text-body-xs uppercase tracking-[0.08em]",
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
                 className="ms-2 hidden rounded-lg px-4 bg-white text-[#050505] transition-colors duration-200 hover:bg-gold-400 hover:text-[#050505] md:inline-flex"
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
                 className="rounded-lg text-white transition-colors duration-200 hover:bg-white/10 hover:text-gold-400 md:hidden"
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
                       "font-display text-sm text-foreground",
                       isAr ? "font-bold" : "font-medium"
                     )}
                   >
                  {t("ديمو موقع بيع السيارات", "Demo of Car Selling Website")}
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
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { delay: 0.05 + NAV_LINKS.length * 0.05, duration: 0.35 }
                    }
                  >
                    <Link
                      href={otherLocalePath}
                      lang={otherLocale}
                      hrefLang={otherLocale}
                      aria-label={dictionary.nav.languageLabel}
                      className={cn(
                        "relative block rounded-lg px-4 py-3.5 text-base transition-colors duration-300",
                        "text-muted-foreground hover:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      {dictionary.nav.switchLanguage}
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { delay: 0.05 + (NAV_LINKS.length + 1) * 0.05, duration: 0.35 }
                    }
                  >
                    <Link
                      href={`/${locale}/login`}
                      className={cn(
                        "relative block rounded-lg px-4 py-3.5 text-base transition-colors duration-300",
                        pathname.includes("/login") || pathname.includes("/admin")
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      {(pathname.includes("/login") || pathname.includes("/admin")) && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-3 start-0 w-px bg-accent"
                        />
                      )}
                      {t("لوحة التحكم", "Admin")}
                    </Link>
                  </motion.li>
               </ul>

               {/* Drawer footer: preferences + contact */}
                <div className="shrink-0 space-y-4 border-t border-border/60 px-5 py-5">
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
