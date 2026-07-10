import { updateApplicationStatus } from "@/lib/actions";
import { internalDecisions } from "@/lib/constants";
import type { Application } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function SelectField({ name, value, options }: { name: string; value: string; options: readonly string[] }) {
  return (
    <select name={name} defaultValue={value} className="h-9 w-full rounded-md border border-border bg-surface px-2 text-xs">
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

export function ApplicationStatusForm({ application }: { application: Application }) {
  const action = updateApplicationStatus.bind(null, application.id);

  return (
    <form action={action} className="grid min-w-[620px] grid-cols-[180px_1fr_90px] gap-2">
      <input type="hidden" name="screening_status" value={application.screening_status} />
      <input type="hidden" name="submission_status" value={application.submission_status} />
      <input type="hidden" name="client_outcome" value={application.client_outcome} />
      <SelectField name="internal_decision" value={application.internal_decision} options={internalDecisions} />
      <Textarea
        name="recruiter_notes"
        defaultValue={application.recruiter_notes ?? ""}
        placeholder="Screening decision notes"
        className="min-h-9 text-xs"
      />
      <Button type="submit" size="sm" variant="outline">Save</Button>
    </form>
  );
}
