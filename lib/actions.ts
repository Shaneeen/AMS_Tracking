"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, requireUser } from "@/lib/supabase/server";
import { applicantSchema, applicationStatusSchema, clientSchema, jobSchema, publicApplicationSchema } from "@/lib/validation";

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

async function logActivity({
  entityType,
  entityId,
  entityLabel,
  action,
  note,
  actor
}: {
  entityType: "client" | "job" | "applicant" | "application";
  entityId: string;
  entityLabel: string;
  action: string;
  note: string;
  actor?: { id: string | null; email?: string | null };
}) {
  const supabase = createSupabaseServerClient();
  await supabase.from("activity_notes").insert({
    entity_type: entityType,
    entity_id: entityId,
    entity_label: entityLabel,
    action,
    note,
    created_by: actor?.id ?? null,
    created_by_email: actor?.email ?? null
  });
}

export async function signIn(_: unknown, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function saveClient(formData: FormData) {
  const user = await requireUser();
  const parsed = clientSchema.parse(values(formData));
  const id = formData.get("id");
  const supabase = createSupabaseServerClient();

  const query = id
    ? supabase.from("clients").update(parsed).eq("id", String(id)).select("id, name").single()
    : supabase.from("clients").insert(parsed).select("id, name").single();
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  await logActivity({
    entityType: "client",
    entityId: data.id,
    entityLabel: data.name,
    action: id ? "updated" : "created",
    note: `${id ? "Updated" : "Created"} client ${data.name}`,
    actor: user
  });
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/clients/${id}`);
}

export async function saveJob(formData: FormData) {
  const user = await requireUser();
  const parsed = jobSchema.parse(values(formData));
  const id = formData.get("id");
  const supabase = createSupabaseServerClient();

  const query = id
    ? supabase.from("jobs").update(parsed).eq("id", String(id)).select("id, title").single()
    : supabase.from("jobs").insert(parsed).select("id, title").single();
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  await logActivity({
    entityType: "job",
    entityId: data.id,
    entityLabel: data.title,
    action: id ? "updated" : "created",
    note: `${id ? "Updated" : "Created"} job ${data.title}`,
    actor: user
  });
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/jobs/${id}`);
}

export async function saveApplicant(formData: FormData) {
  const user = await requireUser();
  const parsed = applicantSchema.parse(values(formData));
  const id = formData.get("id");
  const supabase = createSupabaseServerClient();

  const query = id
    ? supabase.from("applicants").update(parsed).eq("id", String(id)).select("id, full_name").single()
    : supabase.from("applicants").insert(parsed).select("id, full_name").single();
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  await logActivity({
    entityType: "applicant",
    entityId: data.id,
    entityLabel: data.full_name,
    action: id ? "updated" : "created",
    note: `${id ? "Updated" : "Created"} applicant ${data.full_name}`,
    actor: user
  });
  revalidatePath("/applicants");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/applicants/${id}`);
}

export async function updateApplicationStatus(applicationId: string, formData: FormData) {
  const user = await requireUser();
  const parsed = applicationStatusSchema.parse(values(formData));
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("applications")
    .update(parsed)
    .eq("id", applicationId)
    .select("id, job_id, applicants(full_name)")
    .single();

  if (error) throw new Error(error.message);
  const application = data as {
    id: string;
    job_id: string;
    applicants: { full_name: string } | { full_name: string }[] | null;
  };
  const applicant = Array.isArray(application.applicants)
    ? application.applicants[0]
    : application.applicants;
  const applicantName = applicant?.full_name ?? "Applicant";
  await logActivity({
    entityType: "application",
    entityId: application.id,
    entityLabel: applicantName,
    action: "updated status",
    note: `Updated application status for ${applicantName}`,
    actor: user
  });
  revalidatePath(`/jobs/${application.job_id}`);
  revalidatePath(`/jobs/${application.job_id}/tracker`);
  revalidatePath("/dashboard");
}

export async function deleteClient(id: string) {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("clients").select("name").eq("id", id).single();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({
    entityType: "client",
    entityId: id,
    entityLabel: data?.name ?? "Deleted client",
    action: "deleted",
    note: `Deleted client ${data?.name ?? id}`,
    actor: user
  });
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  redirect("/clients");
}

export async function deleteJob(id: string) {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("jobs").select("title").eq("id", id).single();
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({
    entityType: "job",
    entityId: id,
    entityLabel: data?.title ?? "Deleted job",
    action: "deleted",
    note: `Deleted job ${data?.title ?? id}`,
    actor: user
  });
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  redirect("/jobs");
}

export async function deleteApplicant(id: string) {
  const user = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("applicants").select("full_name").eq("id", id).single();
  const { error } = await supabase.from("applicants").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({
    entityType: "applicant",
    entityId: id,
    entityLabel: data?.full_name ?? "Deleted applicant",
    action: "deleted",
    note: `Deleted applicant ${data?.full_name ?? id}`,
    actor: user
  });
  revalidatePath("/applicants");
  revalidatePath("/dashboard");
  redirect("/applicants");
}

export async function submitPublicApplication(_: unknown, formData: FormData) {
  const parsed = publicApplicationSchema.safeParse(values(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Please check the form." };
  }

  const { consent: _consent, job_id, ...applicant } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.rpc("submit_public_application", {
    p_job_id: job_id,
    p_full_name: applicant.full_name,
    p_phone: applicant.phone,
    p_email: applicant.email,
    p_current_company: applicant.current_company,
    p_current_role: applicant.current_role,
    p_expected_salary: applicant.expected_salary ?? null,
    p_notice_period: applicant.notice_period,
    p_source: applicant.source,
    p_resume_url: applicant.resume_url,
    p_notes: applicant.notes
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true, error: null };
}
