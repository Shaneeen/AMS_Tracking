import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import type { ActivityNote } from "@/lib/database.types";
import { getDashboardMetrics, getJobs, getMyRecentActivity, getRecentActivity } from "@/lib/queries";
import { requireUser } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

function actorLabel(activity: ActivityNote) {
  return activity.created_by_email ?? "Public applicant";
}

function ActivityList({ activities, empty }: { activities: ActivityNote[]; empty: string }) {
  return (
    <div className="divide-y divide-border">
      {activities.map((activity) => (
        <div key={activity.id} className="py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{activity.note}</p>
            <span className="rounded-md bg-background px-2 py-1 text-xs capitalize text-muted">
              {activity.entity_type} {activity.action}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {actorLabel(activity)} - {formatDate(activity.created_at)}
          </p>
        </div>
      ))}
      {!activities.length ? <p className="py-8 text-center text-sm text-muted">{empty}</p> : null}
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [metrics, jobs, teamActivity, myActivity] = await Promise.all([
    getDashboardMetrics(user.id),
    getJobs(undefined, "Open"),
    getRecentActivity(),
    getMyRecentActivity(user.id)
  ]);
  const cards = [
    ["Total active jobs", metrics.activeJobs],
    ["Total applicants", metrics.applicants],
    ["New applicants this week", metrics.weeklyApplicants],
    ["New applications this week", metrics.weeklyApplications],
    ["Pending screening", metrics.pendingScreening],
    ["Sent to client", metrics.sentToClient],
    ["Team actions this week", metrics.weeklyActivity],
    ["My actions this week", metrics.myWeeklyActivity]
  ];

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-primary">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Active jobs</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {jobs.slice(0, 6).map((job) => (
            <div key={job.id} className="rounded-lg border border-border bg-surface p-4">
              <p className="font-medium">{job.title}</p>
              <p className="mt-1 text-sm text-muted">{job.clients?.name ?? "No client"} - {job.location ?? "Location TBC"}</p>
            </div>
          ))}
          {!jobs.length ? <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-muted">No active jobs yet.</div> : null}
        </div>
      </section>
      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent>
            <h2 className="mb-1 text-lg font-semibold">Team activity</h2>
            <p className="mb-3 text-sm text-muted">Recent creates, edits, deletes, status updates, and public submissions.</p>
            <ActivityList activities={teamActivity} empty="No team activity recorded yet." />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="mb-1 text-lg font-semibold">My activity</h2>
            <p className="mb-3 text-sm text-muted">Your recent updates in the shared portal.</p>
            <ActivityList activities={myActivity} empty="You have not made any tracked updates yet." />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
