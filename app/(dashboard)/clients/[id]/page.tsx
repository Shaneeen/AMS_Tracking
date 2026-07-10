import Link from "next/link";
import { deleteClient } from "@/lib/actions";
import { getClient } from "@/lib/queries";
import { DeleteButton } from "@/components/forms/delete-button";
import { AppShell } from "@/components/layout/app-shell";
import { ClientForm } from "@/components/forms/client-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id);
  const deleteAction = deleteClient.bind(null, client.id);

  return (
    <AppShell title={client.name} breadcrumbs={[{ label: "Clients", href: "/clients" }, { label: client.name }]}>
      <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Client details</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-2">
              <p><span className="text-muted">Industry:</span> {client.industry ?? "-"}</p>
              <p><span className="text-muted">Status:</span> <Badge>{client.status}</Badge></p>
              <p><span className="text-muted">Contact:</span> {client.contact_name ?? "-"}</p>
              <p><span className="text-muted">Email:</span> {client.contact_email ?? "-"}</p>
              <p><span className="text-muted">Phone:</span> {client.contact_phone ?? "-"}</p>
              <p><span className="text-muted">Account manager:</span> {client.account_manager ?? "-"}</p>
              <p className="md:col-span-2"><span className="text-muted">Notes:</span> {client.notes ?? "-"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Jobs under this client</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {client.jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted">{job.location ?? "-"} - {job.status}</p>
                  </div>
                  <Button asChild variant="outline" size="sm"><Link href={`/jobs/${job.id}`}>View</Link></Button>
                </div>
              ))}
              {!client.jobs.length ? <p className="text-sm text-muted">No jobs created for this client yet.</p> : null}
            </CardContent>
          </Card>
        </section>
        <Card>
          <CardHeader><CardTitle>Edit client</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <ClientForm client={client} />
            <div className="border-t border-border pt-4">
              <DeleteButton action={deleteAction} label={client.name} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
