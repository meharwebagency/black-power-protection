"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Car,
  MessageCircleQuestion,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { PageHeader } from "@/components/admin/shared/page-header";
import { fadeUp, staggerContainer, staggerFast } from "@/lib/motion";
import type { Locale } from "@/types";

interface DashboardPageProps {
  params: Promise<{ locale: Locale }>;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: string;
  color?: string;
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  return (
    <motion.div variants={fadeUp} className="h-full">
      <Card className="relative h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated-lg">
        <CardContent className="flex h-full items-start justify-between gap-4 p-6">
          <div className="min-w-0">
            <p className="text-body-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-display-xs font-bold text-foreground">
              {value}
            </p>
            {trend && (
              <p className="mt-1 flex items-center gap-1 text-body-xs text-success">
                <ArrowUpRight className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              color || "bg-primary/10"
            )}
          >
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface DashboardStats {
  vehicles: { total: number };
  inquiries: { total: number; new: number; contacted: number; closed: number };
  messages: { total: number; unread: number; read: number; archived: number };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [recentInquiries, setRecentInquiries] = React.useState<any[]>([]);
  const [recentMessages, setRecentMessages] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const [statsRes, inquiriesRes, messagesRes] = await Promise.all([
          fetch("/api/admin/dashboard"),
          fetch("/api/admin/inquiries?limit=5"),
          fetch("/api/admin/messages?limit=5"),
        ]);

        const statsData = await statsRes.json();
        const inquiriesData = await inquiriesRes.json();
        const messagesData = await messagesRes.json();

        if (statsData.success) setStats(statsData.data);
        if (inquiriesData.success) setRecentInquiries(inquiriesData.data);
        if (messagesData.success) setRecentMessages(messagesData.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(isArabic ? "ar-KW" : "en-US", {
      month: "short",
      day: "numeric",
    });

  const vehicleLabel = (row: any) => {
    const make = isArabic ? row.vehicle?.make_ar ?? row.vehicle?.make : row.vehicle?.make;
    const model = isArabic ? row.vehicle?.model_ar ?? row.vehicle?.model : row.vehicle?.model;
    const name = [make, model].filter(Boolean).join(" ");
    return name || (isArabic ? "—" : "—");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-secondary" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <PageHeader
          title={isArabic ? "مرحباً بك" : "Welcome back"}
          description={
            isArabic
              ? "إليك نظرة عامة على موقعك"
              : "Here's an overview of your website"
          }
          locale={locale}
          actions={
            <Link href={`/${locale}/admin/vehicles/new`}>
              <Button variant="primary" className="gap-2">
                <Plus className="h-4 w-4" />
                {isArabic ? "إضافة سيارة" : "Add Vehicle"}
              </Button>
            </Link>
          }
        />
      </motion.div>

      <motion.div
        variants={staggerFast}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          icon={<Car className="h-6 w-6 text-primary" />}
          label={isArabic ? "إجمالي السيارات" : "Total Vehicles"}
          value={stats?.vehicles.total || 0}
          color="bg-primary/10"
        />
        <StatCard
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-500" />}
          label={isArabic ? "السيارات النشطة" : "Active Listings"}
          value={stats?.vehicles.total || 0}
          color="bg-emerald-500/10"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          label={isArabic ? "الرسائل غير المقروءة" : "Unread Messages"}
          value={stats?.messages.unread || 0}
          color="bg-amber-500/10"
        />
        <StatCard
          icon={<MessageCircleQuestion className="h-6 w-6 text-blue-500" />}
          label={isArabic ? "الاستفسارات الجديدة" : "New Inquiries"}
          value={stats?.inquiries.new || 0}
          trend={`${stats?.inquiries.total || 0} ${isArabic ? "إجمالي" : "total"}`}
          color="bg-blue-500/10"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Inquiries */}
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-body-lg font-semibold text-foreground">
                  {isArabic ? "آخر الاستفسارات" : "Recent Inquiries"}
                </h3>
                <Link
                  href={`/${locale}/admin/inquiries`}
                  className="text-body-sm text-primary hover:underline"
                >
                  {isArabic ? "عرض الكل" : "View all"}
                </Link>
              </div>

              {recentInquiries.length === 0 ? (
                <p className="py-8 text-center text-body-sm text-muted-foreground">
                  {isArabic ? "لا توجد استفسارات بعد" : "No inquiries yet"}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isArabic ? "العميل" : "Customer"}</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        {isArabic ? "السيارة" : "Vehicle"}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {isArabic ? "التاريخ" : "Date"}
                      </TableHead>
                      <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                      <TableHead className="text-end">
                        {isArabic ? "إجراء" : "Action"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInquiries.map((inquiry: any) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium text-foreground">
                          {inquiry.name}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {vehicleLabel(inquiry)}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {formatDate(inquiry.created_at)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={inquiry.status}
                            type="inquiry"
                            locale={locale}
                          />
                        </TableCell>
                        <TableCell className="text-end">
                          <Link
                            href={`/${locale}/admin/inquiries`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            aria-label={isArabic ? "عرض" : "View"}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Messages */}
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-body-lg font-semibold text-foreground">
                  {isArabic ? "آخر الرسائل" : "Recent Messages"}
                </h3>
                <Link
                  href={`/${locale}/admin/messages`}
                  className="text-body-sm text-primary hover:underline"
                >
                  {isArabic ? "عرض الكل" : "View all"}
                </Link>
              </div>

              {recentMessages.length === 0 ? (
                <p className="py-8 text-center text-body-sm text-muted-foreground">
                  {isArabic ? "لا توجد رسائل بعد" : "No messages yet"}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isArabic ? "العميل" : "Customer"}</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        {isArabic ? "الموضوع" : "Subject"}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {isArabic ? "التاريخ" : "Date"}
                      </TableHead>
                      <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                      <TableHead className="text-end">
                        {isArabic ? "إجراء" : "Action"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMessages.map((msg: any) => (
                      <TableRow key={msg.id}>
                        <TableCell className="font-medium text-foreground">
                          {msg.name}
                        </TableCell>
                        <TableCell className="hidden max-w-40 truncate text-muted-foreground sm:table-cell">
                          {msg.subject || msg.message?.substring(0, 40)}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {formatDate(msg.created_at)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={msg.status}
                            type="message"
                            locale={locale}
                          />
                        </TableCell>
                        <TableCell className="text-end">
                          <Link
                            href={`/${locale}/admin/messages`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            aria-label={isArabic ? "عرض" : "View"}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
