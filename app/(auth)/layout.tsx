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
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.06] via-transparent to-orange/[0.08]" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="mb-8 rounded-full">
            <Image
              src="/images/safegrid-logo-warm.svg"
              alt="SAFEGRID Logo"
              width={280}
              height={378}
              className="mx-auto"
              priority
            />
          </div>

          <p className="text-xl text-muted mb-8 leading-relaxed">
            From emergency response to{" "}
            <span className="text-gold font-medium">preventive safety</span>.
          </p>

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
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background bg-mesh-warm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] via-transparent to-orange/[0.05]" />

        <div className="relative z-10 w-full max-w-md">
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

          <p className="text-center text-xs text-muted mt-8">
            By continuing, you agree to our{" "}
            <Link
              href="#"
              className="text-gold hover:text-gold-hover transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-gold hover:text-gold-hover transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
