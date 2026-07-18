import { ErrorState } from "./states";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ title, message, onRetry, className }: ErrorDisplayProps) {
  return (
    <ErrorState
      title={title}
      message={message}
      onRetry={onRetry}
      className={className}
    />
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-body-sm text-destructive">
      <span className="text-xs">!</span>
      {message}
    </div>
  );
}
