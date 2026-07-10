import { clientStatuses } from "@/lib/constants";
import { getClients } from "@/lib/queries";
import { AppShell } from "@/components/layout/app-shell";
import { ClientForm } from "@/components/forms/client-form";
import { SearchFilter } from "@/components/filters/search-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { clientColumns } from "@/components/tables/client-columns";

export default async function ClientsPage({ searchParams }: { searchParams: { search?: string; status?: string } }) {
  const clients = await getClients(searchParams.search, searchParams.status);

  return (
    <AppShell title="Clients" breadcrumbs={[{ label: "Clients" }]}>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="space-y-4">
          <SearchFilter search={searchParams.search} status={searchParams.status} statuses={clientStatuses} placeholder="Search by client name" />
          <DataTable columns={clientColumns} data={clients} empty="No clients match your filters." />
        </section>
        <Card>
          <CardHeader><CardTitle>Add client</CardTitle></CardHeader>
          <CardContent><ClientForm /></CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
