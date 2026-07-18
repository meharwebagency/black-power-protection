import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <span className="font-display text-display-2xl font-bold text-gold-gradient opacity-80">
            404
          </span>
        </div>
        <h1 className="mb-3 font-display text-display-xs font-bold text-foreground">
          الصفحة غير موجودة
        </h1>
        <p className="mb-8 max-w-md text-body-sm text-muted-foreground text-balance">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link href="/ar">
          <Button size="lg" className="gap-2">
            العودة إلى الرئيسية
          </Button>
        </Link>
      </div>
    </Container>
  );
}
