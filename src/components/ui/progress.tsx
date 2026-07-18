import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "gold" | "success" | "destructive";
  size?: "sm" | "default" | "lg";
  indeterminate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "default",
      size = "default",
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colorMap = {
      default: "bg-primary",
      gold: "gold-gradient",
      success: "bg-emerald-500",
      destructive: "bg-destructive",
    };

    const heightMap = {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
    };

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemax={max}
        className={cn(
          "w-full overflow-hidden rounded-full bg-secondary",
          heightMap[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-luxury",
            colorMap[variant],
            indeterminate && "w-full animate-progress-indeterminate"
          )}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
