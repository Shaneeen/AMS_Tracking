"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import { submitPublicApplication } from "@/lib/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PublicApplicationForm({ jobId }: { jobId: string }) {
  const [state, action] = useFormState(submitPublicApplication, { ok: false, error: null as string | null });
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const { register } = useForm();

  async function uploadResume(file: File | null) {
    if (!file) return;
    setUploading(true);
    const supabase = createSupabaseBrowserClient();
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `public/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("resumes").getPublicUrl(path);
      setResumeUrl(data.publicUrl);
    }
    setUploading(false);
  }

  if (state.ok) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/10 p-5 text-success">
        Your application has been submitted. Thank you.
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="job_id" value={jobId} />
      <input type="hidden" name="resume_url" value={resumeUrl} />
      <Field label="Full name">
        <Input {...register("full_name")} required />
      </Field>
      <Field label="Email">
        <Input {...register("email")} type="email" required />
      </Field>
      <Field label="Phone number">
        <Input {...register("phone")} />
      </Field>
      <Field label="Current company">
        <Input {...register("current_company")} />
      </Field>
      <Field label="Current role">
        <Input {...register("current_role")} />
      </Field>
      <Field label="Expected salary">
        <Input {...register("expected_salary")} type="number" min="0" />
      </Field>
      <Field label="Notice period">
        <Input {...register("notice_period")} />
      </Field>
      <Field label="Source">
        <Input {...register("source")} placeholder="LinkedIn, referral, job board..." />
      </Field>
      <div className="md:col-span-2">
        <Field label="Resume upload">
          <label className="flex min-h-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-background px-4 text-sm text-muted">
            <input className="sr-only" type="file" accept=".pdf,.doc,.docx" onChange={(event) => uploadResume(event.target.files?.[0] ?? null)} />
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : resumeUrl ? "Resume uploaded" : "Upload PDF, DOC or DOCX"}
            </span>
          </label>
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Short notes / relevant experience">
          <Textarea {...register("notes")} />
        </Field>
      </div>
      <label className="md:col-span-2 flex items-start gap-3 text-sm text-muted">
        <input {...register("consent")} type="checkbox" className="mt-1" required />
        I consent to Antares Management Services storing and processing my information for recruitment purposes.
      </label>
      {state.error ? <p className="md:col-span-2 text-sm text-danger">{state.error}</p> : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={uploading}>Submit application</Button>
      </div>
    </form>
  );
}
