import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
    "text-xs font-medium leading-none",
    "transition-colors duration-200",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-border text-foreground bg-transparent",
        ghost: "bg-secondary/50 text-secondary-foreground",
        gold: "gold-gradient text-white",
        muted: "bg-muted text-muted-foreground",
        available: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        sold: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        reserved: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        pending: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      },
      dot: {
        true: "before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:content-['']",
      },
      size: {
        sm: "px-2 py-0.5 text-2xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, dot, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, dot }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
