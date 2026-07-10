import { Search } from "lucide-react";
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
    <form className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
        <Input name="search" defaultValue={search ?? ""} placeholder={placeholder} className="pl-9" />
      </div>
      {statuses ? (
        <select name="status" defaultValue={status ?? ""} className="h-10 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="">All statuses</option>
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      ) : null}
      <Button type="submit" variant="outline">Filter</Button>
    </form>
  );
}
