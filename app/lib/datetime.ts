/** Shared date/time formatting so the dashboard and history agree on wording. */

const DAY = 86_400_000;

export function formatWhen(startedAt: number): string {
  const d = new Date(startedAt);
  const time = d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`;

  const yesterday = new Date(today.getTime() - DAY);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
}
