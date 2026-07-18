"use client";

import * as React from "react";
import { Search, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import type { Locale } from "@/types";

interface MessagesPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function MessagesPage({ params }: MessagesPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [messages, setMessages] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);

  const fetchMessages = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/messages?${params}`);
      const data = await res.json();
      if (data.success) { setMessages(data.data); setTotalPages(data.pagination?.totalPages || 1); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [page, search, statusFilter]);

  React.useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchMessages();
    setSelectedMessage(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={isArabic ? "الرسائل" : "Messages"} description={isArabic ? "إدارة رسائل الاتصال" : "Manage contact messages"} locale={locale} breadcrumbs={[{ label: isArabic ? "لوحة التحكم" : "Dashboard", href: `/${locale}/admin` }, { label: isArabic ? "الرسائل" : "Messages" }]} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={isArabic ? "بحث..." : "Search..."} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="ps-9" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
          <option value="all">{isArabic ? "جميع الحالات" : "All"}</option>
          <option value="unread">{isArabic ? "غير مقروء" : "Unread"}</option>
          <option value="read">{isArabic ? "مقروء" : "Read"}</option>
          <option value="archived">{isArabic ? "مؤرشف" : "Archived"}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />)}</div>
      ) : messages.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12">
          <Mail className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-body-sm text-muted-foreground">{isArabic ? "لا توجد رسائل" : "No messages"}</p>
        </CardContent></Card>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {messages.map((msg: any) => (
            <motion.div key={msg.id} variants={fadeUp}>
              <Card className="cursor-pointer transition-shadow hover:shadow-elevated" onClick={() => setSelectedMessage(msg)}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <Mail className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{msg.name}</p>
                    <p className="truncate text-body-xs text-muted-foreground">{msg.subject || msg.message?.substring(0, 60)}</p>
                  </div>
                  <StatusBadge status={msg.status} type="message" locale={locale} />
                  <span className="shrink-0 text-body-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString(isArabic ? "ar-KW" : "en-US", { month: "short", day: "numeric" })}
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

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedMessage(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-elevated" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-body-lg font-semibold text-foreground">{isArabic ? "تفاصيل الرسالة" : "Message Details"}</h3>
              <button onClick={() => setSelectedMessage(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">{isArabic ? "الاسم:" : "Name:"}</span> <span className="text-foreground">{selectedMessage.name}</span></div>
              <div><span className="text-muted-foreground">{isArabic ? "البريد:" : "Email:"}</span> <span className="text-foreground">{selectedMessage.email}</span></div>
              {selectedMessage.phone && <div><span className="text-muted-foreground">{isArabic ? "الهاتف:" : "Phone:"}</span> <span className="text-foreground">{selectedMessage.phone}</span></div>}
              <div><span className="text-muted-foreground">{isArabic ? "الموضوع:" : "Subject:"}</span> <span className="text-foreground">{selectedMessage.subject}</span></div>
              <div><span className="text-muted-foreground">{isArabic ? "الرسالة:" : "Message:"}</span> <p className="mt-1 text-foreground">{selectedMessage.message}</p></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["unread", "read", "archived"].map(s => (
                <Button key={s} variant={selectedMessage.status === s ? "primary" : "outline"} size="sm" onClick={() => updateStatus(selectedMessage.id, s)}>
                  <StatusBadge status={s} type="message" locale={locale} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
