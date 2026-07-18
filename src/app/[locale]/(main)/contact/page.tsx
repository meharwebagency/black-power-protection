"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CONTACT_INFO, LOGO_URL } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import type { Locale } from "@/types";

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";

  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          subject: formState.subject,
          message: formState.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormState({ name: "", email: "", phone: "", subject: "general", message: "" });
      } else {
        setError(data.error || (isArabic ? "حدث خطأ" : "An error occurred"));
      }
    } catch {
      setError(isArabic ? "حدث خطأ أثناء الإرسال" : "An error occurred while sending");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: isArabic ? "الهاتف" : "Phone",
      content: CONTACT_INFO.phoneFormatted,
      href: `tel:${CONTACT_INFO.phone}`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Mail,
      title: isArabic ? "البريد الإلكتروني" : "Email",
      content: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: MessageCircle,
      title: isArabic ? "واتساب" : "WhatsApp",
      content: CONTACT_INFO.phoneFormatted,
      href: `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-600/10",
    },
    {
      icon: MapPin,
      title: isArabic ? "العنوان" : "Address",
      content: isArabic ? CONTACT_INFO.addressAr : CONTACT_INFO.address,
      href: CONTACT_INFO.googleMaps,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Clock,
      title: isArabic ? "ساعات العمل" : "Working Hours",
      content: isArabic ? CONTACT_INFO.workingHoursAr : CONTACT_INFO.workingHours,
      href: undefined,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
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
                {isArabic ? "اتصل بنا" : "Contact Us"}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-display-sm md:text-display-lg font-bold text-foreground"
            >
              {isArabic ? "تواصل معنا" : "Get in Touch"}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-body-lg md:text-body-xl text-muted-foreground"
            >
              {isArabic
                ? "نسعد بتواصلك معنا في أي وقت"
                : "We'd love to hear from you anytime"}
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Gold divider */}
      <div className="relative py-2">
        <div className="mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </div>

      {/* Contact Cards */}
      <section className="py-16 md:py-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {contactCards.map((card, i) => (
              <motion.div key={i} variants={fadeUp}>
                {card.href ? (
                  <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                    <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated cursor-pointer">
                      <CardContent className="flex flex-col items-center p-6 text-center">
                        <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgColor}`}>
                          <card.icon className={`h-6 w-6 ${card.color}`} />
                        </div>
                        <h3 className="text-body-sm font-semibold text-foreground">{card.title}</h3>
                        <p className="mt-1 text-body-xs text-muted-foreground break-all">{card.content}</p>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgColor}`}>
                        <card.icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                      <h3 className="text-body-sm font-semibold text-foreground">{card.title}</h3>
                      <p className="mt-1 text-body-xs text-muted-foreground">{card.content}</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Gold divider */}
      <div className="relative py-2">
        <div className="mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      </div>

      {/* Form + Map */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}>
                <h2 className="font-display text-display-xs font-bold text-foreground">
                  {isArabic ? "أرسل لنا رسالة" : "Send Us a Message"}
                </h2>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {isArabic
                    ? "وسنرد عليك في أقرب وقت ممكن"
                    : "We'll get back to you as soon as possible"}
                </p>
              </motion.div>

              {submitted ? (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 flex flex-col items-center rounded-2xl bg-emerald-500/10 p-10 text-center"
                >
                  <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-500" />
                  <h3 className="font-display text-body-lg font-semibold text-foreground">
                    {isArabic ? "تم الإرسال بنجاح!" : "Message Sent!"}
                  </h3>
                  <p className="mt-2 text-body-sm text-muted-foreground">
                    {isArabic
                      ? "شكراً لتواصلك معنا. سنرد عليك قريباً."
                      : "Thank you for reaching out. We'll respond soon."}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    {isArabic ? "إرسال رسالة أخرى" : "Send Another Message"}
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  variants={fadeUp}
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{isArabic ? "الاسم الكامل" : "Full Name"}</Label>
                      <Input
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder={isArabic ? "أحمد محمد" : "John Doe"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder={isArabic ? "ahmed@example.com" : "john@example.com"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{isArabic ? "رقم الجوال" : "Phone"}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+965 XXXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">{isArabic ? "الموضوع" : "Subject"}</Label>
                      <select
                        id="subject"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-body-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="general">{isArabic ? "استفسار عام" : "General Inquiry"}</option>
                        <option value="vehicle">{isArabic ? "استفسار عن سيارة" : "Vehicle Inquiry"}</option>
                        <option value="service">{isArabic ? "استفسار عن خدمة" : "Service Inquiry"}</option>
                        <option value="other">{isArabic ? "أخرى" : "Other"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{isArabic ? "رسالتك" : "Your Message"}</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={isArabic ? "اكتب رسالتك هنا..." : "Write your message here..."}
                    />
                  </div>

                  {error && (
                    <p className="text-body-sm text-destructive">{error}</p>
                  )}

                  <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isArabic ? "إرسال الرسالة" : "Send Message"}
                  </Button>
                </motion.form>
              )}
            </motion.div>

            {/* Map */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}>
                <h2 className="font-display text-display-xs font-bold text-foreground">
                  {isArabic ? "موقعنا" : "Our Location"}
                </h2>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {isArabic ? "الكويت" : "Kuwait"}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 overflow-hidden rounded-2xl border border-border">
                <div className="relative aspect-[4/3] w-full bg-secondary/50">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.8!2d47.97!3d29.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDIyJzEyLjAiTiA0N8KwNTgnMTIuMCJF!5e0!3m2!1sen!2skw!4v1700000000000"
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={isArabic ? "موقع بلاك باور بروتكشن" : "Black Power Protection Location"}
                  />
                </div>
              </motion.div>

              {/* Quick contact buttons */}
              <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-3">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    {isArabic ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
                  </Button>
                </a>
                <a href={`tel:${CONTACT_INFO.phone}`}>
                  <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                    <Phone className="h-5 w-5 text-primary" />
                    {isArabic ? "اتصل الآن" : "Call Now"}
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      <WhatsAppButton locale={locale} />
      <ScrollToTop />
    </div>
  );
}
