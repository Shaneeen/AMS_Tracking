import { getApplicants } from "@/lib/queries";
import { screeningStatuses } from "@/lib/constants";
import { AppShell } from "@/components/layout/app-shell";
import { ApplicantForm } from "@/components/forms/applicant-form";
import { SearchFilter } from "@/components/filters/search-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { applicantColumns } from "@/components/tables/applicant-columns";

export default async function ApplicantsPage({ searchParams }: { searchParams: { search?: string; status?: string } }) {
  const allApplicants = await getApplicants(searchParams.search);
  const applicants = searchParams.status
    ? allApplicants.filter((applicant) => applicant.applications.some((application) => application.screening_status === searchParams.status))
    : allApplicants;

  return (
    <AppShell title="Applicants" breadcrumbs={[{ label: "Applicants" }]}>
      <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
        <section className="space-y-4">
          <SearchFilter search={searchParams.search} status={searchParams.status} statuses={screeningStatuses} placeholder="Search by name, email or phone" />
          <DataTable columns={applicantColumns} data={applicants} empty="No applicants match your filters." />
        </section>
        <Card>
          <CardHeader><CardTitle>Add applicant</CardTitle></CardHeader>
          <CardContent><ApplicantForm /></CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
