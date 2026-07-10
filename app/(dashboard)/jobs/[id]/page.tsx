import Link from "next/link";
import { CopyLinkButton } from "@/components/copy-link-button";
import { DeleteButton } from "@/components/forms/delete-button";
import { JobForm } from "@/components/forms/job-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteJob } from "@/lib/actions";
import { getClientOptions, getJob } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, clients] = await Promise.all([getJob(params.id), getClientOptions()]);
  const deleteAction = deleteJob.bind(null, job.id);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const publicLink = `${appUrl}/apply/${job.public_slug}`;

  return (
    <AppShell title={job.title} breadcrumbs={[{ label: "Jobs", href: "/jobs" }, { label: job.title }]}>
      <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Job detail</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-2">
              <p><span className="text-muted">Client:</span> {job.clients?.name ?? "-"}</p>
              <p><span className="text-muted">Location:</span> {job.location ?? "-"}</p>
              <p><span className="text-muted">Salary:</span> {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}</p>
              <p><span className="text-muted">Employment type:</span> {job.employment_type ?? "-"}</p>
              <p><span className="text-muted">Headcount:</span> {job.headcount}</p>
              <p><span className="text-muted">Recruiter:</span> {job.recruiter_in_charge ?? "-"}</p>
              <p><span className="text-muted">Status:</span> <Badge>{job.status}</Badge></p>
              <p><span className="text-muted">Priority:</span> <Badge>{job.priority}</Badge></p>
              <p className="md:col-span-2"><span className="text-muted">Description:</span> {job.description ?? "-"}</p>
              <div className="md:col-span-2 rounded-md border border-border bg-background p-3">
                <p className="mb-2 text-muted">Public application form link</p>
                <div className="flex flex-wrap items-center gap-3">
                  <a href={publicLink} target="_blank" className="break-all text-primary">{publicLink}</a>
                  <CopyLinkButton value={publicLink} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Applications under this job</CardTitle>
                <Button asChild size="sm" variant="secondary"><Link href={`/jobs/${job.id}/tracker`}>Open tracker</Link></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.applications.map((application) => (
                <div key={application.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link className="font-medium text-primary" href={`/applicants/${application.applicants?.id}`}>{application.applicants?.full_name ?? "Applicant"}</Link>
                      <p className="text-sm text-muted">{application.applicants?.email ?? "-"} - {formatDate(application.updated_at)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{application.screening_status}</Badge>
                      <Badge>{application.submission_status}</Badge>
                      <Badge>{application.client_outcome}</Badge>
                    </div>
                  </div>
                </div>
              ))}
              {!job.applications.length ? <p className="text-sm text-muted">No applications for this job yet.</p> : null}
            </CardContent>
          </Card>
        </section>
        <Card>
          <CardHeader><CardTitle>Edit job</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <JobForm job={job} clients={clients} />
            <div className="border-t border-border pt-4">
              <DeleteButton action={deleteAction} label={job.title} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
