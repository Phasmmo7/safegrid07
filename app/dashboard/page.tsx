import { Shield, Map, Navigation, Phone, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/safegrid-logo.svg"
              alt="SAFEGRID"
              width={40}
              height={45}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">
              SAFE<span className="text-primary">GRID</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Welcome, Demo User</span>
            <Link
              href="/login"
              className="p-2 rounded-lg hover:bg-card transition-colors text-muted hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Safety Status Card */}
        <div className="mb-8 p-6 rounded-2xl bg-card border border-card-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-safe/10 border border-safe/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-safe" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">You&apos;re Safe</h1>
              <p className="text-muted">
                No active journeys. Start a Safe Journey to begin monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Navigation, label: "Start Journey", desc: "Begin safe travel", href: "/journey" },
            { icon: Map, label: "Safety Map", desc: "View risk zones", href: "/map" },
            { icon: Phone, label: "Emergency Contacts", desc: "Manage your circle", href: "/contacts" },
            { icon: Shield, label: "Command Center", desc: "Monitor incidents", href: "/command-center" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="p-5 rounded-xl bg-card border border-card-border hover:border-primary/30 transition-all group"
            >
              <action.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">{action.label}</h3>
              <p className="text-sm text-muted">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Status Bar */}
        <div className="p-4 rounded-xl bg-primary-dim border border-primary/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted">
            Voice SOS: <span className="text-primary font-medium">Active</span> — Say &quot;SAFEGRID SOS&quot; to trigger emergency
          </span>
        </div>
      </main>
    </div>
  );
}
