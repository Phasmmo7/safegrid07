import Image from "next/image";
import Link from "next/link";
import { cn } from "@/app/lib/cn";

/* ==========================================================================
   Brand lockup
   --------------------------------------------------------------------------
   The supplied logo is a single 400x540 vertical lockup: shield, then
   "SAFEGRID" wordmark, then a tagline rule. Rendering it whole inside a
   horizontal nav made the bar 86px tall (over the 80px nav cap) and
   illegible at 40px, because the wordmark inside it scaled to roughly 4px.

   Rather than edit the asset (brand marks are not ours to recompose) or drop
   the shield, this crops the shield out for display and pairs it with the
   wordmark set in the UI face. Both halves of the lockup survive; the nav just
   stops showing the wordmark twice.

   Geometry, from the SVG viewBox:
     shield ink box  x 38..362   y 18..422   (324 x 404)
     full lockup     x 0..400    y 0..540
   ========================================================================== */

const SHIELD_W = 324;
const SHIELD_X = 38;
const SHIELD_Y = 18;
const SHIELD_H = 404;
const LOCKUP_W = 400;
const LOCKUP_H = 540;

const MARK_H = 34;
const SCALE = MARK_H / SHIELD_H;

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden",
        className,
      )}
      style={{ width: SHIELD_W * SCALE, height: MARK_H }}
    >
      <Image
        src="/images/safegrid-logo-warm.svg"
        alt=""
        width={LOCKUP_W * SCALE}
        height={LOCKUP_H * SCALE}
        className="absolute max-w-none"
        style={{ left: -SHIELD_X * SCALE, top: -SHIELD_Y * SCALE }}
        priority
      />
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-[1.0625rem] font-semibold tracking-[-0.01em]",
        className,
      )}
    >
      SAFE<span className="text-gold">GRID</span>
    </span>
  );
}

export function BrandLockup({
  href,
  className,
}: {
  href?: string;
  className?: string;
}) {
  const inner = (
    <>
      <BrandMark />
      <Wordmark />
    </>
  );

  if (!href) {
    return <span className={cn("flex items-center gap-2.5", className)}>{inner}</span>;
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg min-h-11 transition-opacity hover:opacity-80",
        className,
      )}
    >
      {inner}
      <span className="sr-only">SAFEGRID home</span>
    </Link>
  );
}
