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
    <div className="min-h-screen flex items-center justify-center bg-mesh overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-primary/30 animate-pulse" />
      <div className="absolute bottom-32 right-16 w-3 h-3 rounded-full bg-primary/20 animate-pulse-sos" />
      <div className="absolute top-1/3 right-10 w-1.5 h-1.5 rounded-full bg-primary/40" />

      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <div className="animate-float mb-8">
          <Image
            src="/images/safegrid-logo.svg"
            alt="SAFEGRID Logo"
            width={240}
            height={324}
            className="mx-auto animate-splash-in"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-xl text-muted animate-splash-in-delay leading-relaxed">
          From emergency response to{" "}
          <span className="text-primary font-medium">preventive safety</span>.
        </p>
      </div>
    </div>
  );
}