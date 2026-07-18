"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  debounceMs?: number;
  locale?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, onChange, debounceMs = 300, locale = "ar", placeholder, ...props }, ref) => {
    const [value, setValue] = React.useState(props.defaultValue as string || "");
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(newValue);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onSearch(newValue);
        }, debounceMs);
      },
      [onSearch, onChange, debounceMs]
    );

    const handleClear = React.useCallback(() => {
      setValue("");
      onChange?.("");
      onSearch("");
    }, [onSearch, onChange]);

    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    return (
      <div className={cn("relative w-full", className)}>
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={handleChange}
          icon={<Search className="h-4 w-4" />}
          placeholder={placeholder || (locale === "ar" ? "بحث..." : "Search...")}
          className="h-12 rounded-2xl bg-secondary/50 ps-11 text-body-sm placeholder:text-muted-foreground/70 focus:bg-background"
          {...props}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClear}
            className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
