import { ApplicationStatusForm } from "@/components/forms/application-status-form";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { getJob } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function JobTrackerPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  const applications = job.applications;
  const count = (field: string, value: string) => applications.filter((application) => application[field as keyof typeof application] === value).length;

  const metrics = [
    ["Total applications", applications.length],
    ["Passed screening", count("screening_status", "Passed Screening")],
    ["Accepted for submission", count("internal_decision", "Accepted for Submission")],
    ["Sent to client", count("submission_status", "Sent to Client")],
    ["Rejected internally", count("internal_decision", "Rejected Internally")],
    ["Rejected by client", count("client_outcome", "Rejected by Client")],
    ["Pending client feedback", count("client_outcome", "Pending")]
  ];

  return (
    <AppShell
      title="Job tracker"
      breadcrumbs={[
        { label: "Jobs", href: "/jobs" },
        { label: job.title, href: `/jobs/${job.id}` },
        { label: "Tracker" }
      ]}
    >
      <div className="mb-6">
        <p className="text-sm text-muted">{job.clients?.name}</p>
        <h2 className="text-2xl font-semibold">{job.title}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1320px] text-left text-sm">
            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Expected salary</th>
                <th className="px-4 py-3">Notice</th>
                <th className="px-4 py-3">Screening / decisions / notes</th>
                <th className="px-4 py-3">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{application.applicants?.full_name ?? "-"}</td>
                  <td className="px-4 py-3">{application.applicants?.phone ?? "-"}</td>
                  <td className="px-4 py-3">{application.applicants?.email ?? "-"}</td>
                  <td className="px-4 py-3">{formatCurrency(application.applicants?.expected_salary)}</td>
                  <td className="px-4 py-3">{application.applicants?.notice_period ?? "-"}</td>
                  <td className="px-4 py-3"><ApplicationStatusForm application={application} /></td>
                  <td className="px-4 py-3">{formatDate(application.updated_at)}</td>
                </tr>
              ))}
              {!applications.length ? (
                <tr><td className="px-4 py-10 text-center text-muted" colSpan={7}>No applicants are linked to this job yet.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
