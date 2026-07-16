import { notFound } from "next/navigation";
import { PublicApplicationForm } from "@/components/forms/public-application-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getJobBySlug } from "@/lib/queries";

export default async function PublicApplyPage({ params }: { params: { publicSlug: string } }) {
  const job = await getJobBySlug(params.publicSlug);
  if (!job) notFound();

  const hasDetails = Boolean(job.description || job.location || job.employment_type);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-semibold text-white shadow-sm">
              A
            </div>
            <p className="text-sm font-medium text-secondary">Antares Management Services</p>
          </div>
          <h1 className="text-3xl font-semibold text-heading">{job.title}</h1>
          <p className="mt-2 text-muted">
            {[job.location, job.employment_type].filter(Boolean).join(" · ") || "Location TBC"}
          </p>
          {job.description ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-text">{job.description}</p>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application form</CardTitle>
            {hasDetails ? (
              <CardDescription>Tell us about yourself — it only takes a few minutes.</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            <PublicApplicationForm jobId={job.id} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
