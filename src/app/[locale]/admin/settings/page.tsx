"use client";

import * as React from "react";
import { Save, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/shared/page-header";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import type { Locale } from "@/types";

interface SettingsPageProps {
  params: Promise<{ locale: Locale }>;
}

const TABS = [
  { id: "general", labelEn: "General", labelAr: "عام" },
  { id: "contact", labelEn: "Contact", labelAr: "اتصال" },
  { id: "social", labelEn: "Social", labelAr: "اجتماعي" },
  { id: "seo", labelEn: "SEO", labelAr: "تحسين محركات البحث" },
  { id: "appearance", labelEn: "Appearance", labelAr: "المظهر" },
];

export default function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [activeTab, setActiveTab] = React.useState("general");
  const [settings, setSettings] = React.useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success) setSettings(data.data);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    }
    fetchSettings();
  }, []);

  const updateSetting = (category: string, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setHasChanges(false);
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  const renderField = (category: string, key: string, value: string) => {
    if (key.includes("description") || key.includes("text") || key.includes("about")) {
      return (
        <div key={`${category}.${key}`} className="space-y-2">
          <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
          <Textarea value={value || ""} onChange={e => updateSetting(category, key, e.target.value)} rows={3} />
        </div>
      );
    }
    return (
      <div key={`${category}.${key}`} className="space-y-2">
        <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
        <Input value={value || ""} onChange={e => updateSetting(category, key, e.target.value)} />
      </div>
    );
  };

  if (isLoading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isArabic ? "الإعدادات" : "Settings"}
        description={isArabic ? "إعدادات الموقع" : "Website settings"}
        locale={locale}
        breadcrumbs={[
          { label: isArabic ? "لوحة التحكم" : "Dashboard", href: `/${locale}/admin` },
          { label: isArabic ? "الإعدادات" : "Settings" },
        ]}
        actions={
          <Button variant="primary" onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isArabic ? "حفظ" : "Save"}
          </Button>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto lg:flex-col lg:min-w-[200px]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {isArabic ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1">
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {settings[activeTab] && Object.entries(settings[activeTab]).map(([key, value]) =>
                    renderField(activeTab, key, value as string)
                  )}
                  {(!settings[activeTab] || Object.keys(settings[activeTab]).length === 0) && (
                    <p className="py-8 text-center text-body-sm text-muted-foreground">
                      {isArabic ? "لا توجد إعدادات" : "No settings available"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
