import type { ReactNode } from "react";
import Link from "next/link";
import {
  AudioLines,
  Navigation,
  Radar,
  Users,
} from "lucide-react";
import { BrandLockup } from "@/app/components/brand";

/* The brand half of the auth split.
   Previously a 50/50 split with a centred logo, a centred tagline and a row of
   four decorative pills. That is the "centred hero over a dark mesh" default.
   Replaced with an asymmetric panel: content anchored to the lower left, a
   large top void, and the capabilities set as a real list with icons rather
   than a pill row.

   No CTA lives here on purpose. The form column already owns the single
   "sign in" intent, and two buttons with the same intent on one screen is a
   fail. */

const capabilities = [
  {
    icon: Navigation,
    title: "Safe journeys",
    body: "Records the route and shares live position with your circle.",
  },
  {
    icon: AudioLines,
    title: "Voice SOS",
    body: 'Raise an alert hands-free by saying "SAFEGRID SOS".',
  },
  {
    icon: Radar,
    title: "Crowd-aware routing",
    body: "Reroutes you toward the busier path, not the fastest one.",
  },
  {
    icon: Users,
    title: "Emergency network",
    body: "Calls three contacts you choose, with your live location.",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel. Hidden below lg, where the form gets a compact lockup. */}
      <div className="relative hidden lg:flex flex-col justify-end overflow-hidden px-12 xl:px-16 pb-14 pt-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-drift"
          style={{
            background:
              "radial-gradient(110% 80% at 0% 100%, rgba(255,179,0,0.13) 0%, rgba(255,179,0,0.035) 34%, transparent 64%)",
          }}
        />

        <div className="relative max-w-lg">
          <BrandLockup />

          <h1 className="mt-12 text-[2.5rem] leading-[1.1] tracking-[-0.03em] text-foreground">
            From emergency response to preventive safety.
          </h1>

          <p className="mt-5 text-muted leading-relaxed max-w-[46ch]">
            SAFEGRID tracks your route and the people around you, then alerts
            your network if something goes wrong.
          </p>

          <ul className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {capabilities.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                <div className="mt-3 text-sm font-medium text-foreground">
                  {title}
                </div>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form column */}
      <div className="flex flex-col px-5 sm:px-8 py-10 sm:py-14">
        <div className="lg:hidden mb-10">
          <BrandLockup />
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto lg:mx-0">{children}</div>
        </div>

        <p className="mt-10 text-xs text-dim leading-relaxed max-w-sm mx-auto lg:mx-0">
          By continuing you agree to the{" "}
          <Link href="#" className="text-muted hover:text-foreground">
            Terms
          </Link>{" "}
          and the{" "}
          <Link href="#" className="text-muted hover:text-foreground">
            Privacy Policy
          </Link>
          . Emergency contact details stay on your device.
        </p>
      </div>
    </div>
  );
}
