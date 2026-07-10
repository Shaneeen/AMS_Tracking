export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        } & Record<string, unknown>;
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          account_manager: string | null;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        } & Record<string, unknown>;
        Insert: Partial<Database["public"]["Tables"]["clients"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          location: string | null;
          salary_min: number | null;
          salary_max: number | null;
          employment_type: string | null;
          headcount: number;
          description: string | null;
          recruiter_in_charge: string | null;
          priority: string;
          status: string;
          public_slug: string;
          created_at: string;
          updated_at: string;
        } & Record<string, unknown>;
        Insert: Partial<Database["public"]["Tables"]["jobs"]["Row"]> & { client_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
        Relationships: [];
      };
      applicants: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string;
          current_company: string | null;
          current_role: string | null;
          expected_salary: number | null;
          notice_period: string | null;
          source: string | null;
          resume_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        } & Record<string, unknown>;
        Insert: Partial<Database["public"]["Tables"]["applicants"]["Row"]> & { full_name: string; email: string };
        Update: Partial<Database["public"]["Tables"]["applicants"]["Row"]>;
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          applicant_id: string;
          job_id: string;
          screening_status: string;
          internal_decision: string;
          submission_status: string;
          client_outcome: string;
          recruiter_notes: string | null;
          submitted_at: string | null;
          interview_at: string | null;
          created_at: string;
          updated_at: string;
        } & Record<string, unknown>;
        Insert: Partial<Database["public"]["Tables"]["applications"]["Row"]> & { applicant_id: string; job_id: string };
        Update: Partial<Database["public"]["Tables"]["applications"]["Row"]>;
        Relationships: [];
      };
      activity_notes: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          action: string;
          entity_label: string | null;
          note: string;
          created_by: string | null;
          created_by_email: string | null;
          created_at: string;
        } & Record<string, unknown>;
        Insert: Partial<Database["public"]["Tables"]["activity_notes"]["Row"]> & {
          entity_type: string;
          entity_id: string;
          note: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_notes"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      submit_public_application: {
        Args: {
          p_job_id: string;
          p_full_name: string;
          p_phone: string | null;
          p_email: string;
          p_current_company: string | null;
          p_current_role: string | null;
          p_expected_salary: number | null;
          p_notice_period: string | null;
          p_source: string | null;
          p_resume_url: string | null;
          p_notes: string | null;
        } & Record<string, unknown>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Applicant = Database["public"]["Tables"]["applicants"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type ActivityNote = Database["public"]["Tables"]["activity_notes"]["Row"];

export type ClientWithJobs = Client & { jobs: Job[] };
export type JobWithClient = Job & { clients: Pick<Client, "name"> | null };
export type ApplicationWithApplicant = Application & { applicants: Applicant | null };
export type JobWithApplications = Job & {
  clients: Client | null;
  applications: ApplicationWithApplicant[];
};
export type ApplicantApplicationHistory = Application & {
  jobs: (Pick<Job, "title"> & { clients: Pick<Client, "name"> | null }) | null;
};
export type ApplicantWithApplications = Applicant & {
  applications: ApplicantApplicationHistory[];
};
export type ApplicantListRow = Applicant & {
  applications: Pick<Application, "screening_status" | "client_outcome">[];
};
export type PublicJob = Pick<Job, "id" | "title" | "location" | "employment_type" | "description">;
