import type { ReactNode } from "react";
import { BrandLockup } from "./brand";

/* Nav height is 60px. The previous bar was 86px because it rendered the full
   400x540 vertical logo lockup at 54px tall. */
export default function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[60px] flex items-center justify-between gap-4">
        <BrandLockup href="/dashboard" />
        <div className="flex items-center gap-2 sm:gap-3">{children}</div>
      </div>
    </header>
  );
}
