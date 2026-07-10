import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items = [] }: { items?: BreadcrumbItem[] }) {
  const crumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/dashboard" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 items-center gap-1 text-sm text-muted">
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {index > 0 ? <ChevronRight className="h-4 w-4 shrink-0" /> : null}
            {index === 0 ? <Home className="h-4 w-4 shrink-0" /> : null}
            {item.href && !isLast ? (
              <Link href={item.href} className="truncate rounded-sm hover:text-text focus:outline-none focus:ring-2 focus:ring-secondary/30">
                {item.label}
              </Link>
            ) : (
              <span className="truncate text-text">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
