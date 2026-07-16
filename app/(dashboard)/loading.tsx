import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <AppShell title="Loading">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent>
                <div className="h-4 w-24 animate-pulse rounded bg-background" />
                <div className="mt-3 h-8 w-16 animate-pulse rounded bg-background" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent>
            <div className="h-64 animate-pulse rounded-lg bg-background" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
