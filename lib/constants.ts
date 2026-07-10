export const clientStatuses = ["Active", "Inactive", "Prospect"] as const;
export const jobStatuses = ["Open", "On Hold", "Closed", "Cancelled"] as const;
export const priorities = ["Low", "Medium", "High", "Urgent"] as const;

export const screeningStatuses = ["Not Screened", "Screening", "Passed Screening", "Failed Screening"] as const;
export const internalDecisions = ["Pending Review", "Accepted for Submission", "Rejected Internally", "KIV"] as const;
export const submissionStatuses = ["Not Sent", "Sent to Client", "Client Reviewing", "Interview Scheduled"] as const;
export const clientOutcomes = ["Pending", "Accepted", "Rejected by Client", "Offered", "Hired", "Withdrawn"] as const;

export type ClientStatus = (typeof clientStatuses)[number];
export type JobStatus = (typeof jobStatuses)[number];
export type ScreeningStatus = (typeof screeningStatuses)[number];
export type InternalDecision = (typeof internalDecisions)[number];
export type SubmissionStatus = (typeof submissionStatuses)[number];
export type ClientOutcome = (typeof clientOutcomes)[number];
