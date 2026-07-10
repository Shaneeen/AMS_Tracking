import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function Topbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">Internal ATS</p>
        <h1 className="text-lg font-semibold text-text">{title ?? "Workspace"}</h1>
      </div>
      <form action={signOut}>
        <Button variant="outline" size="sm" title="Sign out">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </form>
    </header>
  );
}
