"use client";

import * as React from "react";
import { Search, MessageCircleQuestion } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import type { Locale } from "@/types";

interface InquiriesPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function InquiriesPage({ params }: InquiriesPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [selectedInquiry, setSelectedInquiry] = React.useState<any>(null);

  const fetchInquiries = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/inquiries?${params}`);
      const data = await res.json();
      if (data.success) { setInquiries(data.data); setTotalPages(data.pagination?.totalPages || 1); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [page, search, statusFilter]);

  React.useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/inquiries/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchInquiries();
    setSelectedInquiry(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={isArabic ? "الاستفسارات" : "Inquiries"} description={isArabic ? "إدارة استفسارات العملاء" : "Manage customer inquiries"} locale={locale} breadcrumbs={[{ label: isArabic ? "لوحة التحكم" : "Dashboard", href: `/${locale}/admin` }, { label: isArabic ? "الاستفسارات" : "Inquiries" }]} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={isArabic ? "بحث..." : "Search..."} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="ps-9" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
          <option value="all">{isArabic ? "جميع الحالات" : "All"}</option>
          <option value="new">{isArabic ? "جديد" : "New"}</option>
          <option value="contacted">{isArabic ? "تم الاتصال" : "Contacted"}</option>
          <option value="qualified">{isArabic ? "مؤهل" : "Qualified"}</option>
          <option value="closed_won">{isArabic ? "مكتسب" : "Won"}</option>
          <option value="closed_lost">{isArabic ? "خاسر" : "Lost"}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />)}</div>
      ) : inquiries.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12">
          <MessageCircleQuestion className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-body-sm text-muted-foreground">{isArabic ? "لا توجد استفسارات" : "No inquiries"}</p>
        </CardContent></Card>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {inquiries.map((inq: any) => (
            <motion.div key={inq.id} variants={fadeUp}>
              <Card className="cursor-pointer transition-shadow hover:shadow-elevated" onClick={() => setSelectedInquiry(inq)}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                    <MessageCircleQuestion className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{inq.name}</p>
                    <p className="truncate text-body-xs text-muted-foreground">{inq.message?.substring(0, 60)}</p>
                  </div>
                  <StatusBadge status={inq.status} type="inquiry" locale={locale} />
                  <span className="shrink-0 text-body-xs text-muted-foreground">
                    {new Date(inq.created_at).toLocaleDateString(isArabic ? "ar-KW" : "en-US", { month: "short", day: "numeric" })}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Button key={p} variant={p === page ? "primary" : "outline"} size="sm" onClick={() => setPage(p)}>{p}</Button>
          ))}
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedInquiry(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-elevated" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-body-lg font-semibold text-foreground">{isArabic ? "تفاصيل الاستفسار" : "Inquiry Details"}</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">{isArabic ? "الاسم:" : "Name:"}</span> <span className="text-foreground">{selectedInquiry.name}</span></div>
              <div><span className="text-muted-foreground">{isArabic ? "البريد:" : "Email:"}</span> <span className="text-foreground">{selectedInquiry.email}</span></div>
              <div><span className="text-muted-foreground">{isArabic ? "الهاتف:" : "Phone:"}</span> <span className="text-foreground">{selectedInquiry.phone}</span></div>
              <div><span className="text-muted-foreground">{isArabic ? "الرسالة:" : "Message:"}</span> <p className="mt-1 text-foreground">{selectedInquiry.message}</p></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["new", "contacted", "qualified", "closed_won", "closed_lost"].map(s => (
                <Button key={s} variant={selectedInquiry.status === s ? "primary" : "outline"} size="sm" onClick={() => updateStatus(selectedInquiry.id, s)}>
                  <StatusBadge status={s} type="inquiry" locale={locale} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
