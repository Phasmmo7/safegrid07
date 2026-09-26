"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-warm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.06] via-transparent to-orange/[0.08]" />

      <div className="relative z-10 text-center px-6">
        <div className="mb-8 rounded-full">
          <Image
            src="/images/safegrid-logo-warm.svg"
            alt="SAFEGRID Logo"
            width={240}
            height={324}
            className="mx-auto animate-splash-in"
            priority
          />
        </div>

        <p className="text-xl text-muted animate-splash-in-delay leading-relaxed">
          From emergency response to{" "}
          <span className="text-gold font-medium">preventive safety</span>.
        </p>
      </div>
    </div>
  );
}
