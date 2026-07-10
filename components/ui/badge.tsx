import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Open: "bg-success/10 text-success",
  Prospect: "bg-info/10 text-info",
  "On Hold": "bg-warning/10 text-warning",
  Closed: "bg-muted/10 text-muted",
  Cancelled: "bg-danger/10 text-danger",
  "Passed Screening": "bg-success/10 text-success",
  "Failed Screening": "bg-danger/10 text-danger",
  "Accepted for Submission": "bg-success/10 text-success",
  "Rejected Internally": "bg-danger/10 text-danger",
  "Sent to Client": "bg-info/10 text-info",
  "Rejected by Client": "bg-danger/10 text-danger",
  Hired: "bg-success/10 text-success",
  Urgent: "bg-danger/10 text-danger",
  High: "bg-warning/10 text-warning"
};

export function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", toneMap[children] ?? "bg-background text-muted", className)}>
      {children}
    </span>
  );
}
