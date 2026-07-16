import { cn } from "@/lib/utils";

/**
 * Status -> tailwind tone. Every value defined in lib/constants.ts is
 * represented here so badges stay consistent across the whole app.
 * `dot` is the solid indicator colour used to the left of the label.
 */
const toneMap: Record<
  string,
  { wrap: string; dot: string }
> = {
  // Clients
  Active: { wrap: "bg-success/10 text-success", dot: "bg-success" },
  Inactive: { wrap: "bg-muted/10 text-muted", dot: "bg-muted" },
  Prospect: { wrap: "bg-info/10 text-info", dot: "bg-info" },
  // Jobs
  Open: { wrap: "bg-success/10 text-success", dot: "bg-success" },
  "On Hold": { wrap: "bg-warning/10 text-warning", dot: "bg-warning" },
  Closed: { wrap: "bg-muted/10 text-muted", dot: "bg-muted" },
  Cancelled: { wrap: "bg-danger/10 text-danger", dot: "bg-danger" },
  // Priority
  Low: { wrap: "bg-muted/10 text-muted", dot: "bg-muted" },
  Medium: { wrap: "bg-info/10 text-info", dot: "bg-info" },
  High: { wrap: "bg-warning/10 text-warning", dot: "bg-warning" },
  Urgent: { wrap: "bg-danger/10 text-danger", dot: "bg-danger" },
  // Screening
  "Not Screened": { wrap: "bg-muted/10 text-muted", dot: "bg-muted" },
  Screening: { wrap: "bg-info/10 text-info", dot: "bg-info" },
  "Passed Screening": { wrap: "bg-success/10 text-success", dot: "bg-success" },
  "Failed Screening": { wrap: "bg-danger/10 text-danger", dot: "bg-danger" },
  // Internal decision
  "Pending Review": { wrap: "bg-warning/10 text-warning", dot: "bg-warning" },
  "Accepted for Submission": { wrap: "bg-success/10 text-success", dot: "bg-success" },
  "Rejected Internally": { wrap: "bg-danger/10 text-danger", dot: "bg-danger" },
  KIV: { wrap: "bg-muted/10 text-muted", dot: "bg-muted" },
  // Submission
  "Not Sent": { wrap: "bg-muted/10 text-muted", dot: "bg-muted" },
  "Sent to Client": { wrap: "bg-info/10 text-info", dot: "bg-info" },
  "Client Reviewing": { wrap: "bg-info/10 text-info", dot: "bg-info" },
  "Interview Scheduled": { wrap: "bg-secondary/10 text-secondary", dot: "bg-secondary" },
  // Client outcome
  Pending: { wrap: "bg-warning/10 text-warning", dot: "bg-warning" },
  Accepted: { wrap: "bg-success/10 text-success", dot: "bg-success" },
  "Rejected by Client": { wrap: "bg-danger/10 text-danger", dot: "bg-danger" },
  Offered: { wrap: "bg-accent/15 text-accent", dot: "bg-accent" },
  Hired: { wrap: "bg-success/10 text-success", dot: "bg-success" },
  Withdrawn: { wrap: "bg-muted/10 text-muted", dot: "bg-muted" }
};

export function Badge({ children, className }: { children: string; className?: string }) {
  const tone = toneMap[children] ?? { wrap: "bg-background text-muted", dot: "bg-muted" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tone.wrap,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden="true" />
      {children}
    </span>
  );
}
