import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-mesh-warm relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-orange/15" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          {/* Logo */}
          <div className="animate-float mb-8 glow-warm rounded-full">
            <Image
              src="/images/safegrid-logo-warm.svg"
              alt="SAFEGRID Logo"
              width={280}
              height={378}
              className="mx-auto"
              priority
            />
          </div>

          {/* Tagline */}
          <p className="text-xl text-muted mb-8 leading-relaxed">
            From emergency response to{" "}
            <span className="text-gold font-medium">preventive safety</span>.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Safe Journeys",
              "Voice SOS",
              "Risk Assessment",
              "Emergency Network",
            ].map((feature) => (
              <span
                key={feature}
                className="px-4 py-1.5 rounded-full text-sm bg-card border border-card-border text-muted"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-gold/30 animate-pulse" />
        <div className="absolute bottom-32 right-16 w-3 h-3 rounded-full bg-orange/20 animate-pulse-sos" />
        <div className="absolute top-1/3 right-10 w-1.5 h-1.5 rounded-full bg-gold/40" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/images/safegrid-logo-warm.svg"
              alt="SAFEGRID Logo"
              width={120}
              height={162}
              className="mx-auto mb-4"
              priority
            />
          </div>

          {children}

          {/* Footer */}
          <p className="text-center text-xs text-muted mt-8">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-gold hover:text-gold-hover transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-gold hover:text-gold-hover transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
