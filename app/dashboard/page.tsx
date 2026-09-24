import {
  Activity,
  Award,
  ChevronRight,
  Clock,
  HeartPulse,
  Map,
  MapPin,
  Navigation,
  Phone,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LiveMap from "./live-map";
import SetupGuard from "./setup-guard";
import TrustedNetwork from "./trusted-network";

const stats = [
  {
    icon: TrendingUp,
    label: "Journeys completed",
    value: "12",
    sub: "this month",
    accent: "text-gold",
    tint: "bg-gold-dim border-gold/20",
  },
  {
    icon: Users,
    label: "Protection network",
    value: "5",
    sub: "active contacts",
    accent: "text-primary",
    tint: "bg-primary-dim border-primary/20",
  },
  {
    icon: ShieldCheck,
    label: "Alerts resolved",
    value: "3",
    sub: "last 30 days",
    accent: "text-safe",
    tint: "bg-primary-dim border-primary/20",
  },
  {
    icon: HeartPulse,
    label: "Safety score",
    value: "96",
    sub: "out of 100",
    accent: "text-gold",
    tint: "bg-gold-dim border-gold/20",
  },
];

const quickActions = [
  {
    icon: Navigation,
    label: "Start Journey",
    desc: "Begin safe travel",
    href: "/journey",
    primary: true,
  },
  { icon: Map, label: "Safety Map", desc: "View risk zones", href: "/map" },
  {
    icon: Users,
    label: "Emergency Contacts",
    desc: "Manage your circle",
    href: "/contacts",
  },
  {
    icon: Shield,
    label: "Command Center",
    desc: "Monitor incidents",
    href: "/command-center",
  },
];

const recentJourneys = [
  {
    from: "Home",
    to: "Koramangala, Bengaluru",
    date: "Today · 9:40 PM",
    status: "Completed",
    safe: true,
    duration: "22 min",
  },
  {
    from: "Office",
    to: "Indiranagar, Bengaluru",
    date: "Yesterday · 10:15 PM",
    status: "Completed",
    safe: true,
    duration: "18 min",
  },
  {
    from: "Home",
    to: "HSR Layout, Bengaluru",
    date: "Sep 20 · 11:05 PM",
    status: "Completed",
    safe: true,
    duration: "26 min",
  },
];

const tips = [
  "Share your live journey with a trusted contact before night travel.",
  "Keep your emergency PIN updated in your profile.",
  'Say "SAFEGRID SOS" hands-free to raise an alert mid-journey.',
  "Mark high-risk zones on the map after visiting unfamiliar areas.",
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background bg-mesh-warm relative overflow-hidden">
      <SetupGuard />

      {/* Decorative Elements */}
      <div className="absolute top-24 right-16 w-2 h-2 rounded-full bg-gold/30 animate-pulse" />
      <div className="absolute bottom-40 left-10 w-3 h-3 rounded-full bg-orange/20 animate-pulse-sos" />

      {/* Header */}
      <header className="relative z-10 border-b border-card-border px-6 py-4 bg-background/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/safegrid-logo.svg"
              alt="SAFEGRID"
              width={40}
              height={54}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">
              SAFE<span className="text-primary">GRID</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block px-3 py-1.5 rounded-full bg-primary-dim border border-primary/20 text-xs text-primary font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1.5 align-middle" />
              Monitoring Active
            </div>
            <span className="text-sm text-muted hidden md:block">
              Welcome, Demo User
            </span>
            <Link
              href="/login"
              className="p-2 rounded-lg hover:bg-card transition-colors text-muted hover:text-foreground"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Safety Status Hero */}
        <div className="mb-8 p-6 rounded-2xl bg-card border border-card-border bg-card/60 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-safe/10 border border-safe/20 flex items-center justify-center glow-primary-sm">
                <Shield className="w-8 h-8 text-safe" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  You&apos;re Safe
                  <span className="ml-3 align-middle inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-safe/10 border border-safe/20 text-xs text-safe font-medium">
                    <MapPin className="w-3 h-3" /> Bengaluru, IN
                  </span>
                </h1>
                <p className="text-muted">
                  No active journeys. Start a Safe Journey to begin monitoring.
                </p>
              </div>
            </div>
            <Link
              href="/journey"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-background font-semibold text-sm hover:bg-gold-hover transition-all glow-warm-sm"
            >
              <Navigation className="w-4 h-4" />
              Start Safe Journey
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl bg-card border border-card-border"
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${stat.tint}`}
              >
                <stat.icon className={`w-5 h-5 ${stat.accent}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium text-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Live Location Map */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" /> Live Location
            </h2>
            <span className="text-xs text-muted flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Tracking active
            </span>
          </div>
          <LiveMap />
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`p-5 rounded-xl border transition-all group relative overflow-hidden ${
                action.primary
                  ? "bg-gold-dim border-gold/30 hover:border-gold/60"
                  : "bg-card border-card-border hover:border-primary/30"
              }`}
            >
              <action.icon
                className={`w-6 h-6 mb-3 group-hover:scale-110 transition-transform ${
                  action.primary ? "text-gold" : "text-primary"
                }`}
              />
              <h3 className="font-semibold mb-1">{action.label}</h3>
              <p className="text-sm text-muted">{action.desc}</p>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Voice SOS Status */}
        <div className="p-4 rounded-xl bg-primary-dim border border-primary/10 flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted">
            Voice SOS: <span className="text-primary font-medium">Active</span>{" "}
            — Say &quot;SAFEGRID SOS&quot; to trigger emergency
          </span>
        </div>

        {/* Recent Journeys + Safety Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Journeys */}
          <div className="p-5 rounded-2xl bg-card border border-card-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" /> Recent Journeys
              </h2>
              <span className="text-xs text-muted flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-safe" /> All safe
              </span>
            </div>
            <ul className="space-y-3">
              {recentJourneys.map((journey) => (
                <li
                  key={journey.to}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background border border-card-border"
                >
                  <div className="flex flex-col items-center gap-1 px-1">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <div className="w-px h-4 bg-card-border" />
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {journey.from} → {journey.to}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      {journey.date} · {journey.duration}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-safe font-medium bg-primary-dim border border-primary/20 px-2.5 py-1 rounded-full">
                    {journey.status}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/journey"
              className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:text-gold-hover transition-colors"
            >
              View all journeys <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Safety Tips */}
          <div className="p-5 rounded-2xl bg-card border border-card-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" /> Safety Tips
            </h2>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background border border-card-border"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gold-dim border border-gold/20 text-gold text-xs font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Contacts Preview */}
        <div className="mt-4 p-5 rounded-2xl bg-card border border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Trusted Network
            </h2>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-hover transition-colors"
            >
              Manage <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <TrustedNetwork />
          </div>
        </div>

        {/* Live Monitoring Bar */}
        <div className="mt-4 p-4 rounded-xl bg-gold-dim border border-gold/10 flex items-center gap-3">
          <Activity className="w-4 h-4 text-gold" />
          <span className="text-sm text-muted">
            Live ambient monitoring: location, speed and audio anomalies are
            checking continuously while you travel.
          </span>
          <span className="ml-auto shrink-0 h-2 w-2 rounded-full bg-gold animate-pulse" />
        </div>
      </main>
    </div>
  );
}