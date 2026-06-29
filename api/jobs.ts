import type { VercelRequest, VercelResponse } from "@vercel/node";

type AdzunaJob = {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  redirect_url: string;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  created?: string;
};

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  state: string;
  category: string;
  workType: string;
  level: string;
  opportunityType: string;
  salary: string;
  link: string;
  description: string;
  source: string;
  datePosted: string;
};

const states = ["Iowa", "Tennessee", "Louisiana"];

const searches = [
  { category: "Software Development", term: "software developer" },
  { category: "Software Development", term: "web developer" },
  { category: "Software Development", term: "react developer" },
  { category: "Cybersecurity", term: "cybersecurity analyst" },
  { category: "Cybersecurity", term: "security analyst" },
  { category: "Data Analytics", term: "data analyst" },
  { category: "Data Analytics", term: "reporting analyst" },
];

function detectWorkType(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("remote")) return "Remote";
  if (lower.includes("hybrid")) return "Hybrid";
  return "On-Site";
}

function detectLevel(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("intern")) return "Internship";
  if (lower.includes("apprentice")) return "Apprenticeship";
  if (lower.includes("senior") || lower.includes("sr")) return "Senior Level";
  if (lower.includes("mid")) return "Mid Level";
  if (
    lower.includes("junior") ||
    lower.includes("entry") ||
    lower.includes("associate")
  ) {
    return "Entry Level";
  }

  return "Entry Level";
}

function detectOpportunityType(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("contract")) return "Contract";
  if (lower.includes("intern")) return "Internship";
  if (lower.includes("apprentice")) return "Apprenticeship";
  if (lower.includes("part-time")) return "Part-Time";

  return "Full-Time";
}

function formatSalary(job: AdzunaJob) {
  if (job.salary_min && job.salary_max) {
    return `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(
      job.salary_max
    ).toLocaleString()}`;
  }

  if (job.salary_min) {
    return `$${Math.round(job.salary_min).toLocaleString()}+`;
  }

  return "Not listed";
}

async function fetchJobs(term: string, state: string, category: string) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("Missing Adzuna environment variables.");
  }

  const params = new URLSearchParams({
    app_id: appId.trim(),
    app_key: appKey.trim(),
    what: term,
    where: state,
    results_per_page: "10",
  });

  const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?${params}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.log("Adzuna failed:", {
      status: response.status,
      term,
      state,
      data,
    });

    return [];
  }

  const results: AdzunaJob[] = data.results || [];

  return results.map((job): Job => {
    const title = job.title || "Untitled Job";
    const description = job.description || "No description available.";
    const location = job.location?.display_name || state;
    const fullText = `${title} ${description} ${location}`;

    return {
      id: job.id,
      title,
      company: job.company?.display_name || "Company not listed",
      location,
      state,
      category,
      workType: detectWorkType(fullText),
      level: detectLevel(fullText),
      opportunityType: detectOpportunityType(fullText),
      salary: formatSalary(job),
      link: job.redirect_url,
      description,
      source: "Adzuna",
      datePosted: job.created || "",
    };
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const allJobs: Job[] = [];

    for (const state of states) {
      for (const search of searches) {
        const jobs = await fetchJobs(search.term, state, search.category);
        allJobs.push(...jobs);
      }
    }

    const uniqueJobs = Array.from(
      new Map(allJobs.map((job) => [job.id, job])).values()
    );

    res.status(200).json({
      jobs: uniqueJobs.slice(0, 75),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to load real jobs right now.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}