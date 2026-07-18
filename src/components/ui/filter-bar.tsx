"use client";

import * as React from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
}: FilterSelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 items-center gap-2 rounded-xl border px-4 text-body-sm",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          value
            ? "border-primary bg-primary/5 text-foreground"
            : "border-input bg-background text-muted-foreground hover:border-foreground/30"
        )}
      >
        <span className="text-body-xs font-medium text-muted-foreground">{label}:</span>
        <span className={cn("truncate", value ? "text-foreground" : "")}>
          {selectedLabel || placeholder || "—"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-1.5 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-elevated-lg">
          <button
            type="button"
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-2 text-body-sm transition-colors",
              !value ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            onClick={() => {
              onChange?.(undefined);
              setOpen(false);
            }}
          >
            {placeholder || "All"}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-body-sm transition-colors",
                value === option.value
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterBarProps {
  children: React.ReactNode;
  activeCount?: number;
  onClearAll?: () => void;
  className?: string;
  locale?: string;
}

function FilterBar({
  children,
  activeCount = 0,
  onClearAll,
  className,
  locale = "ar",
}: FilterBarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-body-sm font-medium text-foreground">
            {locale === "ar" ? "التصفية" : "Filters"}
          </span>
          {activeCount > 0 && (
            <Badge variant="secondary" size="sm">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-body-xs text-muted-foreground hover:text-foreground"
          >
            <X className="me-1 h-3 w-3" />
            {locale === "ar" ? "مسح الكل" : "Clear all"}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

interface SortSelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  locale?: string;
  className?: string;
}

function SortSelect({ options, value, onChange, locale = "ar", className }: SortSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 appearance-none rounded-xl border border-input bg-background px-4 pe-8 text-body-sm",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "cursor-pointer"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export { FilterSelect, FilterBar, SortSelect };
