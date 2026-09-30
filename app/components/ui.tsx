import type {
  ButtonHTMLAttributes,
  ComponentProps,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import Link from "next/link";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/cn";

/* ==========================================================================
   SAFEGRID primitives
   --------------------------------------------------------------------------
   Shape lock (skill 4.4), enforced here once so no page has to remember it:
     surfaces -> rounded-2xl   controls -> rounded-xl   chips -> rounded-full

   Design intent: these primitives deliberately do NOT default to "a bordered
   filled box". The previous build wrapped nearly every block in one and the
   result read as card soup. `Panel` is now opt-in for the few places where
   elevation genuinely carries hierarchy; everything else is meant to be laid
   out with spacing, hairlines and type. Reach for `Divider` and `Metric`
   before you reach for `Panel`.
   ========================================================================== */

type PanelTone = "raised" | "sunken" | "flush";

const panelTones: Record<PanelTone, string> = {
  raised: "bg-card border border-card-border",
  sunken: "bg-surface-sunken border border-card-border",
  flush: "",
};

export function Panel({
  tone = "raised",
  className,
  children,
}: {
  tone?: PanelTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl", panelTones[tone], className)}>
      {children}
    </div>
  );
}

/* Kept as a named export so the change is explicit at every call site. */
export const Card = Panel;

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-hairline", className)} />;
}

/* A figure, not a container. Reads as an instrument readout. */
export function Metric({
  value,
  label,
  sub,
  tone = "default",
  className,
}: {
  value: ReactNode;
  label: string;
  sub?: string;
  tone?: "default" | "safe";
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div
        className={cn(
          "font-mono text-3xl leading-none tracking-tight",
          tone === "safe" ? "text-safe-text" : "text-foreground",
        )}
      >
        {value}
      </div>
      <div className="mt-2 text-sm font-medium text-foreground">{label}</div>
      {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

/* One row inside a divide-y group. Provides the row only, not the box. */
export function ListRow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <li className={cn("py-3.5 first:pt-0 last:pb-0", className)}>{children}</li>
  );
}

const controlBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium " +
  "transition-[background-color,border-color,color,transform] duration-200 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const controlVariants: Record<ButtonVariant, string> = {
  /* #ffb300 on #080b12 is 10.8:1. */
  primary: "bg-gold text-background font-semibold hover:bg-gold-hover",
  ghost: "border border-card-border text-foreground hover:border-gold-edge hover:bg-surface-raised",
  quiet: "border border-card-border text-muted hover:text-foreground hover:border-gold-edge",
  danger: "bg-danger-dim border border-danger-edge text-danger-text font-semibold hover:bg-danger/25",
  tinted: "bg-gold-dim border border-gold-edge text-gold font-semibold hover:bg-gold/15",
  bare: "text-gold hover:text-gold-hover px-0",
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
        controlBase,
        controlVariants[variant],
        block && "w-full py-3.5",
        variant === "bare" && "active:translate-y-0",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
          <span className="sr-only">Working</span>
        </>
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
        controlBase,
        controlVariants[variant],
        block && "w-full py-3.5",
        variant === "bare" && "active:translate-y-0",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

/* Labels sit above inputs, never inside them. Helper text is optional but
   present in every form in this app. Placeholders are text and must clear
   AA, so they use the full muted token with no alpha reduction. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger-text">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
};

export function Input({
  icon,
  trailing,
  invalid,
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          {icon}
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-xl bg-input-bg border text-foreground text-sm",
          "placeholder:text-muted focus:outline-none focus:border-gold",
          "transition-colors duration-200 py-3",
          invalid ? "border-danger-edge" : "border-input-border",
          icon ? "pl-11" : "pl-4",
          trailing ? "pr-12" : "pr-4",
          className,
        )}
        {...props}
      />
      {trailing}
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: ReactNode;
};

export function Select({ icon, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          {icon}
        </span>
      )}
      <select
        className={cn(
          "w-full appearance-none rounded-xl bg-input-bg border border-input-border",
          "text-foreground text-sm py-3 pr-10 focus:outline-none focus:border-gold",
          "transition-colors duration-200 disabled:opacity-60",
          icon ? "pl-11" : "pl-4",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        strokeWidth={2}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
      />
    </div>
  );
}

const chipVariants: Record<ChipTone, string> = {
  gold: "bg-gold-dim border-gold-edge text-gold",
  safe: "bg-safe-dim border-safe-edge text-safe-text",
  neutral: "border-card-border text-muted",
};

export type ChipTone = "gold" | "safe" | "neutral";

/* Chip, not pill. Chips are for compact state and selection. Anything larger
   is a Button. */
export function Chip({
  tone = "gold",
  className,
  children,
}: {
  tone?: ChipTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-xs font-medium whitespace-nowrap",
        chipVariants[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const Pill = Chip;

/* Setup progression.
   The previous build labelled these "Step 1 of 2" / "Step 2 of 2", which is a
   banned generic step label. A progress meter plus the step's own verb-noun
   carries the same information without the filler. */
export function SetupProgress({
  current,
  steps,
}: {
  current: number;
  steps: string[];
}) {
  return (
    <div className="max-w-[15rem]">
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={current + 1}
        aria-label="Setup progress"
        className="flex gap-1.5"
      >
        {steps.map((step, i) => (
          <span
            key={step}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              i <= current ? "bg-gold" : "bg-card-border",
            )}
          />
        ))}
      </div>
      <p className="mt-2.5 text-xs text-muted">{steps[current]}</p>
    </div>
  );
}

/* Section heading. No eyebrow slot by design: a small uppercase label above
   every heading was the single most-repeated tell in the previous build. The
   heading and its position carry the categorisation. */
export function SectionHeading({
  action,
  className,
  children,
}: {
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 mb-5", className)}>
      <h2 className="text-base font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}

/* Live readout. The dot is permitted here and only here: it encodes real
   sensor state, not decoration. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full bg-safe animate-live shrink-0",
        className,
      )}
    />
  );
}

export function StatusStrip({
  tone = "safe",
  className,
  children,
}: {
  tone?: "safe" | "warning" | "neutral";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    safe: "bg-safe-dim border-safe-edge",
    warning: "bg-warning-dim border-warning-edge",
    neutral: "bg-surface-sunken border-card-border",
  } as const;

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 flex items-start gap-3 text-sm",
        tones[tone],
        className,
      )}
    >
      {tone === "safe" && <LiveDot className="mt-1.5" />}
      <div className="text-muted leading-relaxed">{children}</div>
    </div>
  );
}
