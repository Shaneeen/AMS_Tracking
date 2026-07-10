"use client";

import { useRef, useState, type FormEvent } from "react";
import { Wand2 } from "lucide-react";
import { saveJob } from "@/lib/actions";
import { jobStatuses, priorities } from "@/lib/constants";
import type { Client, Job } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function slugFromTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type ExtractedJobFields = {
  title?: string;
  client_name?: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  headcount?: number;
  recruiter_in_charge?: string;
  priority?: string;
  description?: string;
};

export function JobForm({ job, clients }: { job?: Job; clients: Pick<Client, "id" | "name">[] }) {
  const fallbackSlug = job ? job.public_slug : "";
  const formRef = useRef<HTMLFormElement>(null);
  const [documentText, setDocumentText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState<string | null>(null);

  function setField(name: string, value: string | number | undefined) {
    if (value == null || value === "") return;
    const field = formRef.current?.elements.namedItem(name);
    if (!field) return;
    (field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = String(value);
  }

  function matchClient(clientName?: string) {
    if (!clientName) return undefined;
    const lower = clientName.toLowerCase();
    return clients.find((client) => client.name.toLowerCase() === lower || lower.includes(client.name.toLowerCase()))?.id;
  }

  async function extractFields(event: FormEvent) {
    event.preventDefault();
    const text = documentText.trim();
    if (!text) return;

    setIsExtracting(true);
    setExtractStatus(null);

    try {
      const response = await fetch("/api/jobs/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document: text })
      });
      const result = (await response.json()) as { fields?: ExtractedJobFields; source?: string; error?: string };
      if (!response.ok || !result.fields) throw new Error(result.error ?? "Extraction failed.");

      const fields = result.fields;
      setField("client_id", matchClient(fields.client_name));
      setField("title", fields.title);
      setField("location", fields.location);
      setField("employment_type", fields.employment_type);
      setField("salary_min", fields.salary_min);
      setField("salary_max", fields.salary_max);
      setField("headcount", fields.headcount);
      setField("recruiter_in_charge", fields.recruiter_in_charge);
      setField("priority", fields.priority);
      setField("description", fields.description);
      if (fields.title) setField("public_slug", slugFromTitle(fields.title));
      setExtractStatus(result.source === "hybrid" ? "Extracted with local model" : "Extracted with rules");
    } catch (error) {
      setExtractStatus(error instanceof Error ? error.message : "Extraction failed.");
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <form ref={formRef} action={saveJob} className="grid gap-4 md:grid-cols-2">
      {job ? <input type="hidden" name="id" value={job.id} /> : null}
      <div className="md:col-span-2">
        <Field label="Paste job document">
          <Textarea
            value={documentText}
            onChange={(event) => setDocumentText(event.target.value)}
            className="min-h-36"
          />
        </Field>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" onClick={extractFields} disabled={isExtracting || !documentText.trim()}>
            <Wand2 className="h-4 w-4" />
            {isExtracting ? "Extracting..." : "Extract"}
          </Button>
          {extractStatus ? <p className="text-sm text-muted">{extractStatus}</p> : null}
        </div>
      </div>
      <Field label="Client">
        <select name="client_id" defaultValue={job?.client_id ?? ""} className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm" required>
          <option value="" disabled>Choose client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Job title">
        <Input name="title" defaultValue={job?.title ?? ""} required />
      </Field>
      <Field label="Location">
        <Input name="location" defaultValue={job?.location ?? ""} />
      </Field>
      <Field label="Employment type">
        <Input name="employment_type" defaultValue={job?.employment_type ?? "Full-time"} />
      </Field>
      <Field label="Salary minimum">
        <Input name="salary_min" type="number" min="0" defaultValue={job?.salary_min ?? ""} />
      </Field>
      <Field label="Salary maximum">
        <Input name="salary_max" type="number" min="0" defaultValue={job?.salary_max ?? ""} />
      </Field>
      <Field label="Headcount">
        <Input name="headcount" type="number" min="1" defaultValue={job?.headcount ?? 1} required />
      </Field>
      <Field label="Recruiter-in-charge">
        <Input name="recruiter_in_charge" defaultValue={job?.recruiter_in_charge ?? ""} />
      </Field>
      <Field label="Priority">
        <select name="priority" defaultValue={job?.priority ?? "Medium"} className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm">
          {priorities.map((priority) => <option key={priority}>{priority}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={job?.status ?? "Open"} className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm">
          {jobStatuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </Field>
      <Field label="Public slug">
        <Input name="public_slug" defaultValue={fallbackSlug || slugFromTitle(job?.title ?? "new-job")} required />
      </Field>
      <div className="md:col-span-2">
        <Field label="Description">
          <Textarea name="description" defaultValue={job?.description ?? ""} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Button type="submit">{job ? "Save job" : "Add job"}</Button>
      </div>
    </form>
  );
}
