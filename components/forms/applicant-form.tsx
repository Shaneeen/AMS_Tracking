import { saveApplicant } from "@/lib/actions";
import type { Applicant } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ApplicantForm({ applicant }: { applicant?: Applicant }) {
  return (
    <form action={saveApplicant} className="grid gap-4 md:grid-cols-2">
      {applicant ? <input type="hidden" name="id" value={applicant.id} /> : null}
      <Field label="Full name">
        <Input name="full_name" defaultValue={applicant?.full_name ?? ""} required />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" defaultValue={applicant?.email ?? ""} required />
      </Field>
      <Field label="Phone">
        <Input name="phone" defaultValue={applicant?.phone ?? ""} />
      </Field>
      <Field label="Current company">
        <Input name="current_company" defaultValue={applicant?.current_company ?? ""} />
      </Field>
      <Field label="Current role">
        <Input name="current_role" defaultValue={applicant?.current_role ?? ""} />
      </Field>
      <Field label="Expected salary">
        <Input name="expected_salary" type="number" min="0" defaultValue={applicant?.expected_salary ?? ""} />
      </Field>
      <Field label="Notice period">
        <Input name="notice_period" defaultValue={applicant?.notice_period ?? ""} />
      </Field>
      <Field label="Source">
        <Input name="source" defaultValue={applicant?.source ?? ""} />
      </Field>
      <Field label="Resume URL">
        <Input name="resume_url" defaultValue={applicant?.resume_url ?? ""} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Notes">
          <Textarea name="notes" defaultValue={applicant?.notes ?? ""} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Button type="submit">{applicant ? "Save applicant" : "Add applicant"}</Button>
      </div>
    </form>
  );
}
