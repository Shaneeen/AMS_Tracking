import { z } from "zod";
import {
  clientOutcomes,
  clientStatuses,
  internalDecisions,
  jobStatuses,
  priorities,
  screeningStatuses,
  submissionStatuses
} from "@/lib/constants";

const optionalMoney = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.coerce.number().nonnegative().optional()
);
const optionalText = z.string().trim().optional().transform((value) => value || null);

export const clientSchema = z.object({
  name: z.string().trim().min(1, "Client name is required"),
  industry: optionalText,
  contact_name: optionalText,
  contact_email: z.string().trim().email("Use a valid email").optional().or(z.literal("").transform(() => null)),
  contact_phone: optionalText,
  account_manager: optionalText,
  status: z.enum(clientStatuses),
  notes: optionalText
});

export const jobSchema = z.object({
  client_id: z.string().uuid("Choose a client"),
  title: z.string().trim().min(1, "Job title is required"),
  location: optionalText,
  salary_min: optionalMoney,
  salary_max: optionalMoney,
  employment_type: optionalText,
  headcount: z.coerce.number().int().positive("Headcount must be at least 1"),
  description: optionalText,
  recruiter_in_charge: optionalText,
  priority: z.enum(priorities),
  status: z.enum(jobStatuses),
  public_slug: z.string().trim().min(3, "Public slug is required").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens")
});

export const applicantSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  phone: optionalText,
  email: z.string().trim().email("Use a valid email"),
  current_company: optionalText,
  current_role: optionalText,
  expected_salary: optionalMoney,
  notice_period: optionalText,
  source: optionalText,
  resume_url: optionalText,
  notes: optionalText
});

export const applicationStatusSchema = z.object({
  screening_status: z.enum(screeningStatuses),
  internal_decision: z.enum(internalDecisions),
  submission_status: z.enum(submissionStatuses),
  client_outcome: z.enum(clientOutcomes),
  recruiter_notes: optionalText
});

export const publicApplicationSchema = applicantSchema.extend({
  job_id: z.string().uuid(),
  resume_url: z.string().trim().optional().transform((value) => value || null),
  consent: z.literal("on", { errorMap: () => ({ message: "Consent is required" }) })
});
