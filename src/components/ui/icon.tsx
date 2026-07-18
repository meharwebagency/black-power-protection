import * as React from "react";
import { cn } from "@/lib/utils";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: IconSize;
  children: React.ReactNode;
}

const iconSizes: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

function Icon({ size = "md", className, children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(iconSizes[size], "shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: IconSize;
  variant?: "ghost" | "outline" | "primary";
}

function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  className,
  ...props
}: IconButtonProps) {
  const variantClasses = {
    ghost: "hover:bg-secondary text-muted-foreground hover:text-foreground",
    outline: "border border-input bg-background hover:bg-secondary",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "xs" && "h-7 w-7 rounded-lg",
        size === "sm" && "h-8 w-8 rounded-lg",
        size === "md" && "h-10 w-10",
        size === "lg" && "h-12 w-12",
        size === "xl" && "h-14 w-14 rounded-2xl",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

export { Icon, IconButton };
export type { IconSize };
