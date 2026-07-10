import { notFound } from "next/navigation";
import { PublicApplicationForm } from "@/components/forms/public-application-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobBySlug } from "@/lib/queries";

export default async function PublicApplyPage({ params }: { params: { publicSlug: string } }) {
  const job = await getJobBySlug(params.publicSlug);
  if (!job) notFound();

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm font-medium text-secondary">Antares Management Services</p>
          <h1 className="mt-2 text-3xl font-semibold text-primary">{job.title}</h1>
          <p className="mt-2 text-muted">{job.location ?? "Location TBC"} - {job.employment_type ?? "Employment type TBC"}</p>
          {job.description ? <p className="mt-4 text-sm leading-6 text-text">{job.description}</p> : null}
        </div>
        <Card>
          <CardHeader><CardTitle>Application form</CardTitle></CardHeader>
          <CardContent><PublicApplicationForm jobId={job.id} /></CardContent>
        </Card>
      </div>
    </main>
  );
}
