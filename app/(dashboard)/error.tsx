"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <AppShell title="Error">
      <div className="rounded-lg border border-danger/20 bg-surface p-6">
        <h2 className="text-lg font-semibold text-danger">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted">{error.message}</p>
        <Button className="mt-4" onClick={reset}>Try again</Button>
      </div>
    </AppShell>
  );
}
