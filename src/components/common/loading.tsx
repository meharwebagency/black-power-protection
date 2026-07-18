import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Spinner ── */
interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-primary", spinnerSizes[size], className)}
    />
  );
}

/* ── Loading Spinner (centered) ── */
interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Spinner size={size} />
      {text && <p className="text-body-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

/* ── Page Loader ── */
function PageLoader({ text }: { text?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Premium loading spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-gold-400/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-gold-400/60 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>
        <p className="text-body-sm text-muted-foreground">
          {text || "جاري التحميل..."}
        </p>
      </div>
    </div>
  );
}

/* ── Button Loader ── */
function ButtonLoader({ className }: { className?: string }) {
  return <Spinner size="sm" className={className} />;
}

/* ── Full Page Overlay Loader ── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-gold-400/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 animate-spin" />
        </div>
        <p className="text-body-sm text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );
}

export { Spinner, LoadingSpinner, PageLoader, ButtonLoader, FullPageLoader };
