import { LogOut, Menu } from "lucide-react";
import { signOut } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function Topbar({
  title,
  onMenuClick
}: {
  title?: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-md p-2 text-muted transition hover:bg-background hover:text-text lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted">Internal ATS</p>
          <h1 className="truncate text-lg font-semibold text-heading">{title ?? "Workspace"}</h1>
        </div>
      </div>
      <form action={signOut}>
        <Button variant="outline" size="sm" title="Sign out">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </form>
    </header>
  );
}
