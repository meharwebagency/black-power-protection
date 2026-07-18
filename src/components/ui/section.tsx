import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  centered?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, title, subtitle, centered = true, size = "md", children, ...props }, ref) => (
    <section ref={ref} className={cn(sizeMap[size], className)} {...props}>
      {(title || subtitle) && (
        <div className={cn("mb-12 md:mb-16", centered && "text-center")}>
          {title && (
            <h2 className="font-display text-display-xs md:text-display-sm lg:text-display-md font-bold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
);
Section.displayName = "Section";

export { Section };
