import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchFilter({
  search,
  status,
  statuses,
  placeholder
}: {
  search?: string;
  status?: string;
  statuses?: readonly string[];
  placeholder: string;
}) {
  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input name="search" defaultValue={search ?? ""} placeholder={placeholder} className="pl-9" />
      </div>
      {statuses ? (
        <div className="relative">
          <select
            name="status"
            defaultValue={status ?? ""}
            className="h-10 w-full cursor-pointer appearance-none rounded-md border border-border bg-surface pl-3 pr-9 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 sm:w-48"
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>
      ) : null}
      <Button type="submit" variant="outline" className="sm:w-auto">
        Filter
      </Button>
    </form>
  );
}
