import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ActivityNote,
  ApplicantListRow,
  ApplicantWithApplications,
  Client,
  ClientWithJobs,
  JobWithApplications,
  JobWithClient,
  PublicJob
} from "@/lib/database.types";

export async function getDashboardMetrics(userId?: string) {
  const supabase = createSupabaseServerClient();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [
    activeJobs,
    applicants,
    weeklyApplicants,
    weeklyApplications,
    pendingScreening,
    sentToClient,
    rejectedByClient,
    weeklyActivity,
    myWeeklyActivity
  ] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "Open"),
    supabase.from("applicants").select("id", { count: "exact", head: true }),
    supabase.from("applicants").select("id", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
    supabase.from("applications").select("id", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("screening_status", "Not Screened"),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("submission_status", "Sent to Client"),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("client_outcome", "Rejected by Client"),
    supabase.from("activity_notes").select("id", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
    userId
      ? supabase
          .from("activity_notes")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekStart.toISOString())
          .eq("created_by", userId)
      : Promise.resolve({ count: 0 })
  ]);

  return {
    activeJobs: activeJobs.count ?? 0,
    applicants: applicants.count ?? 0,
    weeklyApplicants: weeklyApplicants.count ?? 0,
    weeklyApplications: weeklyApplications.count ?? 0,
    pendingScreening: pendingScreening.count ?? 0,
    sentToClient: sentToClient.count ?? 0,
    rejectedByClient: rejectedByClient.count ?? 0,
    weeklyActivity: weeklyActivity.count ?? 0,
    myWeeklyActivity: myWeeklyActivity.count ?? 0
  };
}

export async function getRecentActivity(limit = 12) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("activity_notes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data as ActivityNote[];
}

export async function getMyRecentActivity(userId: string, limit = 8) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("activity_notes")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data as ActivityNote[];
}

export async function getClients(search?: string, status?: string) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from("clients").select("*").order("updated_at", { ascending: false });
  if (search) query = query.ilike("name", `%${search}%`);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Client[];
}

export async function getClient(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("clients").select("*, jobs(*)").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data as ClientWithJobs;
}

export async function getJobs(search?: string, status?: string) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from("jobs").select("*, clients(name)").order("updated_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const jobs = data as JobWithClient[];
  if (!search) return jobs;
  const term = search.toLowerCase();
  return jobs.filter((job) => job.title.toLowerCase().includes(term) || job.clients?.name.toLowerCase().includes(term));
}

export async function getJob(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, clients(*), applications(*, applicants(*))")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as JobWithApplications;
}

export async function getJobBySlug(publicSlug: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, location, employment_type, description")
    .eq("public_slug", publicSlug)
    .eq("status", "Open")
    .single();
  if (error) return null;
  return data as PublicJob;
}

export async function getApplicants(search?: string) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from("applicants").select("*, applications(screening_status, client_outcome)").order("updated_at", { ascending: false });
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as ApplicantListRow[];
}

export async function getApplicant(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("applicants")
    .select("*, applications(*, jobs(title, clients(name)))")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as ApplicantWithApplications;
}

export async function getClientOptions() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("clients").select("id, name").order("name");
  if (error) throw new Error(error.message);
  return data as Pick<Client, "id" | "name">[];
}
