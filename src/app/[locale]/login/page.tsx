"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validation/auth.schema";
import { createClient } from "@/lib/supabase/client";
import { LOGO_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/lib/motion";
import type { Locale } from "@/types";

interface LoginPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError(
          error.message.includes("Invalid login")
            ? (isArabic ? "بريد إلكتروني أو كلمة مرور غير صحيحة" : "Invalid email or password")
            : error.message
        );
        return;
      }

      // Full-document navigation (not router.push): forces the server /
      // middleware and the client auth gate to re-read the session cookies
      // that signInWithPassword just set, avoiding the soft-navigation race
      // that redirected back to /login.
      window.location.assign(`/${locale}/admin`);
    } catch (e) {
      console.error("[Login] Error:", e);
      setError(
        isArabic ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gold-400/5 blur-3xl" />
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 p-2">
            <img
              src={LOGO_URL}
              alt="BPP"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="font-display text-display-xs font-bold text-foreground">
            {isArabic ? "لوحة التحكم" : "Admin Panel"}
          </h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            {isArabic
              ? "سجّل الدخول لإدارة الموقع"
              : "Sign in to manage your website"}
          </p>
        </div>

        {/* Login form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-destructive/10 p-3 text-center text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {isArabic ? "البريد الإلكتروني" : "Email"}
              </label>
              <Input
                type="email"
                placeholder={isArabic ? "admin@bpp.com" : "admin@bpp.com"}
                icon={<Mail className="h-4 w-4" />}
                error={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-body-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {isArabic ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isArabic ? "••••••••" : "••••••••"}
                  icon={<Lock className="h-4 w-4" />}
                  error={!!errors.password}
                  className="pe-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-body-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="luxury"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              {isArabic ? "تسجيل الدخول" : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-body-xs text-muted-foreground">
          {isArabic
            ? "بلاك باور بروتكشن © 2025"
            : "BLACK POWER PROTECTION © 2025"}
        </p>
      </motion.div>
    </div>
  );
}
