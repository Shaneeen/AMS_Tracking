import Link from "next/link";
import { deleteApplicant } from "@/lib/actions";
import { getApplicant } from "@/lib/queries";
import { DeleteButton } from "@/components/forms/delete-button";
import { AppShell } from "@/components/layout/app-shell";
import { ApplicantForm } from "@/components/forms/applicant-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ApplicantProfilePage({ params }: { params: { id: string } }) {
  const applicant = await getApplicant(params.id);
  const deleteAction = deleteApplicant.bind(null, applicant.id);

  return (
    <AppShell title={applicant.full_name} breadcrumbs={[{ label: "Applicants", href: "/applicants" }, { label: applicant.full_name }]}>
      <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic details</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm md:grid-cols-2">
              <p><span className="text-muted">Email:</span> {applicant.email}</p>
              <p><span className="text-muted">Phone:</span> {applicant.phone ?? "-"}</p>
              <p><span className="text-muted">Current company:</span> {applicant.current_company ?? "-"}</p>
              <p><span className="text-muted">Current role:</span> {applicant.current_role ?? "-"}</p>
              <p><span className="text-muted">Expected salary:</span> {formatCurrency(applicant.expected_salary)}</p>
              <p><span className="text-muted">Notice period:</span> {applicant.notice_period ?? "-"}</p>
              <p><span className="text-muted">Source:</span> {applicant.source ?? "-"}</p>
              <p>
                <span className="text-muted">Resume:</span>{" "}
                {applicant.resume_url ? <a className="text-primary" href={applicant.resume_url} target="_blank">Open resume</a> : "-"}
              </p>
              <p className="md:col-span-2"><span className="text-muted">Notes:</span> {applicant.notes ?? "-"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Application history</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {applicant.applications.map((application) => (
                <div key={application.id} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{application.jobs?.title ?? "Job"}</p>
                      <p className="text-sm text-muted">{application.jobs?.clients?.name ?? "-"} - Applied {formatDate(application.created_at)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{application.screening_status}</Badge>
                      <Badge>{application.client_outcome}</Badge>
                    </div>
                  </div>
                </div>
              ))}
              {!applicant.applications.length ? <p className="text-sm text-muted">No applications yet.</p> : null}
              <Button asChild variant="outline" size="sm"><Link href="/jobs">Add application from a job</Link></Button>
            </CardContent>
          </Card>
        </section>
        <Card>
          <CardHeader><CardTitle>Edit applicant</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <ApplicantForm applicant={applicant} />
            <div className="border-t border-border pt-4">
              <DeleteButton action={deleteAction} label={applicant.full_name} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
