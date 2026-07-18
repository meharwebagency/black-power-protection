"use client";

import * as React from "react";
import { ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  locale?: string;
  siblingCount?: number;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  locale = "ar",
  siblingCount = 1,
}: PaginationProps) {
  const isRtl = locale === "ar";
  const range = React.useMemo(() => {
    const totalVisible = siblingCount * 2 + 5;
    if (totalPages <= totalVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const pages: (number | "ellipsis")[] = [1];

    if (showLeftEllipsis) {
      pages.push("ellipsis");
    } else {
      for (let i = 2; i < leftSibling; i++) pages.push(i);
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) pages.push(i);
    }

    if (showRightEllipsis) {
      pages.push("ellipsis");
    } else {
      for (let i = rightSibling + 1; i < totalPages; i++) pages.push(i);
    }

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={isRtl ? "الصفحة السابقة" : "Previous page"}
      >
        <PrevIcon className="h-4 w-4" />
      </Button>

      {range.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <div
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          );
        }

        return (
          <Button
            key={item}
            variant={currentPage === item ? "primary" : "ghost"}
            size="icon-sm"
            onClick={() => onPageChange(item)}
            aria-label={`${isRtl ? "صفحة" : "Page"} ${item}`}
            aria-current={currentPage === item ? "page" : undefined}
          >
            {item}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={isRtl ? "الصفحة التالية" : "Next page"}
      >
        <NextIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
}

export { Pagination };
