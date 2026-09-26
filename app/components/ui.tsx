import type {
  ButtonHTMLAttributes,
  ComponentProps,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/lib/cn";

const surface = "rounded-xl border border-card-border";

export function Card({
  className,
  glass,
  children,
}: {
  className?: string;
  glass?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        surface,
        glass ? "bg-card/50 backdrop-blur-sm" : "bg-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-gold text-background hover:bg-gold-hover font-semibold",
  ghost:
    "bg-card border border-card-border text-foreground font-medium hover:border-gold/40",
  quiet:
    "bg-card border border-card-border text-muted font-medium hover:text-foreground hover:border-gold/40",
  danger:
    "bg-danger/15 border border-danger/30 text-danger font-semibold hover:bg-danger/25",
  tinted:
    "bg-gold-dim border border-gold/30 text-gold font-semibold hover:bg-gold/15",
  bare: "text-gold font-medium hover:text-gold-hover",
};

export type ButtonVariant =
  | "primary"
  | "ghost"
  | "quiet"
  | "danger"
  | "tinted"
  | "bare";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  block?: boolean;
};

export function Button({
  variant = "primary",
  loading = false,
  block = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonBase,
        buttonVariants[variant],
        block && "w-full py-3.5",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  block?: boolean;
};

export function ButtonLink({
  variant = "primary",
  block = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonBase,
        buttonVariants[variant],
        block && "w-full py-3.5",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  trailing?: ReactNode;
  small?: boolean;
};

export function Input({
  icon,
  trailing,
  small,
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-lg bg-input-bg border border-input-border text-foreground",
          "placeholder:text-muted/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all",
          small ? "py-2.5 text-sm" : "py-3",
          icon ? (small ? "pl-9" : "pl-11") : small ? "pl-3" : "pl-4",
          trailing ? (small ? "pr-10" : "pr-12") : small ? "pr-3" : "pr-4",
          className,
        )}
        {...props}
      />
      {trailing}
    </div>
  );
}

const pillVariants: Record<PillTone, string> = {
  gold: "bg-gold-dim border-gold/25 text-gold",
  safe: "bg-safe-dim border-safe/25 text-safe",
  neutral: "bg-card border-card-border text-muted",
};

export type PillTone = "gold" | "safe" | "neutral";

export function Pill({
  tone = "gold",
  className,
  children,
}: {
  tone?: PillTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium",
        pillVariants[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  icon,
  action,
  className,
  children,
}: {
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <h2 className="text-lg font-semibold flex items-center gap-2">
        {icon && <span className="text-gold">{icon}</span>}
        {children}
      </h2>
      {action}
    </div>
  );
}

export function StatusStrip({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-safe-dim border border-safe/20 flex items-center gap-3",
        className,
      )}
    >
      <span className="w-2 h-2 rounded-full bg-safe animate-pulse shrink-0" />
      <div className="text-sm text-muted flex items-center gap-1.5 flex-wrap">
        {children}
      </div>
    </div>
  );
}
