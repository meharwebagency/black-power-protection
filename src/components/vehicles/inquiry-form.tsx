"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Send, User, Phone, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface InquiryFormProps {
  vehicle: Vehicle;
  locale: Locale;
}

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export function InquiryForm({ vehicle, locale }: InquiryFormProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const reduceMotion = useReducedMotion();

  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // The API requires a message of at least 10 characters. Fall back to a
    // default message (matching the placeholder) when the user leaves it blank.
    const finalMessage =
      message.trim().length > 0
        ? message.trim()
        : t(
            `أنا مهتم بـ ${vehicleName}. يرجى التواصل معي.`,
            `I'm interested in the ${vehicleName}. Please contact me.`
          );

    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: finalMessage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        const detail =
          data?.details?.[0]?.message ||
          data?.error ||
          t("فشل إرسال الاستفسار", "Failed to send inquiry");
        setError(detail);
      }
    } catch {
      setError(
        t("حدث خطأ أثناء الإرسال", "An error occurred while sending")
      );
    } finally {
      setLoading(false);
    }
  };

  const vehicleName = `${locale === "ar" ? vehicle.makeAr : vehicle.make} ${locale === "ar" ? vehicle.modelAr : vehicle.model}`;

  if (submitted) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXURY }}
        className="flex flex-col items-center rounded-xl border border-border/70 bg-card p-8 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </div>
        <h3 className="font-display text-body-lg font-semibold text-foreground">
          {t("تم إرسال طلبك بنجاح!", "Your inquiry has been sent")}
        </h3>
        <p className="mt-2 text-body-sm text-muted-foreground">
          {t("سنتواصل معك قريباً", "We'll get back to you soon")}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() => { setSubmitted(false); resetForm(); }}
        >
          {t("إرسال طلب آخر", "Send Another")}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE_LUXURY }}
      onSubmit={handleSubmit}
      className="rounded-xl border border-border/70 bg-card p-6"
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-accent" aria-hidden />
        <span className="text-2xs font-medium uppercase tracking-[0.18em] text-muted-foreground ltr:tracking-[0.18em] rtl:tracking-normal">
          {t("استفسار", "Enquire")}
        </span>
      </div>
      <h3 className="mt-4 font-display text-display-xs font-semibold text-foreground">
        {t("استفسر عن هذه السيارة", "Enquire About This Vehicle")}
      </h3>
      <p className="mt-1.5 text-body-sm text-muted-foreground">
        {vehicleName} <span className="opacity-40">·</span> {vehicle.year}
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="inquiry-name">{t("الاسم الكامل", "Full Name")}</Label>
          <div className="relative mt-1.5">
            <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="inquiry-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("أدخل اسمك", "Enter your name")}
              className="ps-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="inquiry-phone">{t("رقم الهاتف", "Phone Number")}</Label>
          <div className="relative mt-1.5">
            <Phone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="inquiry-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 XXX XXX XXXX"
              className="ps-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="inquiry-email">{t("البريد الإلكتروني", "Email")}</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="inquiry-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("بريدك الإلكتروني", "your@email.com")}
              className="ps-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="inquiry-message">{t("الرسالة", "Message")}</Label>
          <div className="relative mt-1.5">
            <MessageSquare className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              id="inquiry-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t(
                `أنا مهتم بـ ${vehicleName}. يرجى التواصل معي.`,
                `I'm interested in the ${vehicleName}. Please contact me.`
              )}
              className="min-h-[100px] ps-10"
              rows={4}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-body-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        className="mt-5 gap-2"
        isLoading={loading}
      >
        <Send className="h-4 w-4" />
        {t("إرسال الاستفسار", "Send Inquiry")}
      </Button>
    </motion.form>
  );
}
