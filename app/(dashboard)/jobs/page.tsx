import { jobStatuses } from "@/lib/constants";
import { getClientOptions, getJobs } from "@/lib/queries";
import { AppShell } from "@/components/layout/app-shell";
import { JobForm } from "@/components/forms/job-form";
import { SearchFilter } from "@/components/filters/search-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { jobColumns } from "@/components/tables/job-columns";

export default async function JobsPage({ searchParams }: { searchParams: { search?: string; status?: string } }) {
  const [jobs, clients] = await Promise.all([getJobs(searchParams.search, searchParams.status), getClientOptions()]);

  return (
    <AppShell title="Jobs" breadcrumbs={[{ label: "Jobs" }]}>
      <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
        <section className="space-y-4">
          <SearchFilter search={searchParams.search} status={searchParams.status} statuses={jobStatuses} placeholder="Search by job title or client" />
          <DataTable columns={jobColumns} data={jobs} empty="No jobs match your filters." />
        </section>
        <Card>
          <CardHeader><CardTitle>Add job</CardTitle></CardHeader>
          <CardContent><JobForm clients={clients} /></CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
