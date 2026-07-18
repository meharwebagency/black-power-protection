import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "default" | "lg" | "xl";
}

const sizeClasses = {
  xs: "h-6 w-6 text-2xs",
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function Avatar({
  src,
  alt,
  fallback,
  size = "default",
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-secondary",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || ""}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium text-muted-foreground">
          {fallback || "?"}
        </div>
      )}
    </div>
  );
}

function AvatarGroup({
  children,
  className,
  max = 4,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { max?: number }) {
  const childrenArray = React.Children.toArray(children);
  const visible = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...props}>
      {visible}
      {remaining > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium text-muted-foreground">
          +{remaining}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup };
