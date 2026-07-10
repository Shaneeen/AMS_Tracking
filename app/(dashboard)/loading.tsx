import { AppShell } from "@/components/layout/app-shell";

export default function Loading() {
  return (
    <AppShell title="Loading">
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-lg bg-surface" />
        <div className="h-64 animate-pulse rounded-lg bg-surface" />
      </div>
    </AppShell>
  );
}
