"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  aspectRatio?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  showIcon?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

function ImagePlaceholder({
  src,
  alt = "",
  aspectRatio = 16 / 9,
  fill = false,
  sizes,
  className,
  showIcon = true,
  rounded = "xl",
  ...props
}: ImagePlaceholderProps) {
  const [imgError, setImgError] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const hasImage = src && !imgError;

  return (
    <div
      className={cn(
        "overflow-hidden bg-secondary/60",
        roundedMap[rounded],
        // In `fill` mode the root must be a positioned, full-size box so the
        // Next.js <Image fill> (absolute inset-0) has real height. A plain
        // `relative` div collapses to 0px, which renders as a black area.
        fill ? "absolute inset-0" : "relative",
        !fill && `aspect-[${aspectRatio}]`,
        className
      )}
      style={!fill ? { aspectRatio } : undefined}
      {...props}
    >
      {hasImage ? (
        <>
          {!imgLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          <Image
            src={src}
            alt={alt}
            fill={fill}
            sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
            className={cn(
              "object-cover transition-opacity duration-500",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-secondary/80 via-secondary to-secondary/60">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
          {showIcon && (
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
              <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
            </div>
          )}
          {alt && (
            <span className="relative max-w-[80%] truncate text-center text-2xs text-muted-foreground/50">
              {alt}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { ImagePlaceholder };
