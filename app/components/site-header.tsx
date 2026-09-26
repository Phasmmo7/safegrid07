import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="relative z-10 border-b border-card-border px-6 py-4 bg-background/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/images/safegrid-logo.svg"
            alt="SAFEGRID"
            width={40}
            height={54}
            className="rounded-lg"
          />
          <span className="text-xl font-bold tracking-tight">
            SAFE<span className="text-gold">GRID</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
