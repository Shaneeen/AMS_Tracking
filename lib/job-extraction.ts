import { priorities } from "@/lib/constants";

export type ExtractedJobFields = {
  title?: string;
  client_name?: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  headcount?: number;
  recruiter_in_charge?: string;
  priority?: (typeof priorities)[number];
  description?: string;
};

type ExtractionResult = {
  fields: ExtractedJobFields;
  source: "rules" | "hybrid";
};

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Permanent"
];

function cleanLine(line: string) {
  return line.replace(/^[#*\-\s]+/, "").trim();
}

function firstMatch(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return cleanLine(match[1]);
  }
  return undefined;
}

function parseMoney(value: string) {
  const compact = value.toLowerCase().replace(/[, $sgd]/g, "");
  const match = compact.match(/(\d+(?:\.\d+)?)(k)?/);
  if (!match) return undefined;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return undefined;
  return Math.round(match[2] ? amount * 1000 : amount);
}

function extractSalary(text: string) {
  const salaryLine =
    text.match(/(?:salary|compensation|pay|budget|package)[:\s-]+([^\n]+)/i)?.[1] ??
    text.match(/(?:sgd|s\$|\$)\s?[\d,.]+k?(?:\s?[-–to]+\s?(?:sgd|s\$|\$)?\s?[\d,.]+k?)?/i)?.[0];

  if (!salaryLine) return {};

  const values = salaryLine.match(/(?:sgd|s\$|\$)?\s?\d+(?:[,.]\d+)*(?:\.\d+)?k?/gi) ?? [];
  const amounts = values.map(parseMoney).filter((value): value is number => value != null);
  if (!amounts.length) return {};
  if (amounts.length === 1) return { salary_min: amounts[0] };
  return { salary_min: Math.min(...amounts), salary_max: Math.max(...amounts) };
}

function extractDescription(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean);

  return lines.slice(0, 24).join("\n");
}

export function extractJobFieldsWithRules(documentText: string): ExtractedJobFields {
  const text = documentText.replace(/\r\n/g, "\n").trim();
  const lines = text.split("\n").map(cleanLine).filter(Boolean);
  const title =
    firstMatch(text, [
      /(?:job title|position|role)[:\s-]+([^\n]+)/i,
      /hiring\s+(?:for\s+)?([^\n]+)/i
    ]) ?? lines.find((line) => line.length > 3 && line.length <= 80);

  const employment_type = employmentTypes.find((type) => new RegExp(type.replace("-", "[-\\s]?"), "i").test(text));
  const urgent = /\b(urgent|asap|immediate|high priority)\b/i.test(text);
  const lowPriority = /\b(low priority|evergreen|pipeline)\b/i.test(text);
  const headcountMatch = text.match(/(?:headcount|vacanc(?:y|ies)|openings?|pax|hire[s]?)[:\s-]+(\d+)/i);

  return {
    title,
    client_name: firstMatch(text, [/(?:client|company|organization|organisation)[:\s-]+([^\n]+)/i]),
    location: firstMatch(text, [/(?:location|based in|work location)[:\s-]+([^\n]+)/i]),
    employment_type,
    ...extractSalary(text),
    headcount: headcountMatch ? Number(headcountMatch[1]) : undefined,
    recruiter_in_charge: firstMatch(text, [/(?:recruiter|owner|pic|person in charge)[:\s-]+([^\n]+)/i]),
    priority: urgent ? "Urgent" : lowPriority ? "Low" : undefined,
    description: extractDescription(text)
  };
}

function normalizeFields(fields: ExtractedJobFields): ExtractedJobFields {
  const normalized: ExtractedJobFields = {};
  for (const [key, value] of Object.entries(fields) as [keyof ExtractedJobFields, string | number | undefined][]) {
    if (value == null || value === "") continue;
    normalized[key] = value as never;
  }
  if (normalized.priority && !priorities.includes(normalized.priority)) delete normalized.priority;
  return normalized;
}

async function extractWithOllama(documentText: string, fallback: ExtractedJobFields) {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  if (!baseUrl) return null;

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL ?? "llama3.2:3b",
      stream: false,
      format: "json",
      prompt: [
        "Extract job fields from this document. Return only JSON.",
        "Allowed keys: title, client_name, location, employment_type, salary_min, salary_max, headcount, recruiter_in_charge, priority, description.",
        "priority must be one of Low, Medium, High, Urgent. Use numbers for salary/headcount.",
        `Rule-based draft: ${JSON.stringify(fallback)}`,
        `Document:\n${documentText.slice(0, 12000)}`
      ].join("\n\n")
    }),
    signal: AbortSignal.timeout(12000)
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { response?: string };
  if (!payload.response) return null;
  return normalizeFields(JSON.parse(payload.response) as ExtractedJobFields);
}

export async function extractJobFields(documentText: string): Promise<ExtractionResult> {
  const fallback = normalizeFields(extractJobFieldsWithRules(documentText));

  try {
    const ollamaFields = await extractWithOllama(documentText, fallback);
    if (ollamaFields) return { fields: { ...fallback, ...ollamaFields }, source: "hybrid" };
  } catch {
    // Local model is optional; rule-based extraction remains the fallback.
  }

  return { fields: fallback, source: "rules" };
}
