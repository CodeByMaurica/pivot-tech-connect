import type { VercelRequest, VercelResponse } from "@vercel/node";

type AdzunaJob = {
  id: string;
  title: string;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
  };
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

const allowedStates = ["Iowa", "Tennessee", "Louisiana"];

const searchGroups = [
  {
    category: "Software Development",
    terms: [
      "software developer",
      "frontend developer",
      "react developer",
      "junior software engineer",
      "web developer",
    ],
  },
  {
    category: "Cybersecurity",
    terms: [
      "cybersecurity analyst",
      "security analyst",
      "soc analyst",
      "information security analyst",
    ],
  },
  {
    category: "Data Analytics",
    terms: [
      "data analyst",
      "business analyst data",
      "reporting analyst",
      "junior data analyst",
    ],
  },
];

function detectState(location: string) {
  if (location.toLowerCase().includes("iowa")) return "Iowa";
  if (location.toLowerCase().includes("tennessee")) return "Tennessee";
  if (location.toLowerCase().includes("louisiana")) return "Louisiana";
  return "Remote";
}

function detectWorkType(title: string, description: string, location: string) {
  const text = `${title} ${description} ${location}`.toLowerCase();

  if (text.includes("remote")) return "Remote";
  if (text.includes("hybrid")) return "Hybrid";
  return "On-Site";
}

function detectLevel(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("intern")) return "Internship";
  if (text.includes("apprentice") || text.includes("apprenticeship")) {
    return "Apprenticeship";
  }
  if (text.includes("senior") || text.includes("sr.")) return "Senior Level";
  if (text.includes("mid") || text.includes("intermediate")) return "Mid Level";
  if (
    text.includes("junior") ||
    text.includes("entry") ||
    text.includes("associate") ||
    text.includes("level 1")
  ) {
    return "Entry Level";
  }

  return "Entry Level";
}

function detectOpportunityType(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("contract")) return "Contract";
  if (text.includes("intern")) return "Internship";
  if (text.includes("apprentice") || text.includes("apprenticeship")) {
    return "Apprenticeship";
  }
  if (text.includes("part-time")) return "Part-Time";

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

async function fetchAdzunaJobs(query: string, state: string, category: string) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("Missing ADZUNA_APP_ID or ADZUNA_APP_KEY");
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: "10",
    what: query,
    where: state,
    content_type: "application/json",
    sort_by: "date",
  });

  const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Adzuna request failed: ${response.status}`);
  }

  const data = await response.json();
  const results: AdzunaJob[] = data.results || [];

  return results.map((job): Job => {
    const title = job.title || "Untitled Job";
    const description = job.description || "No description available.";
    const location = job.location?.display_name || state;
    const detectedState = detectState(location);
    const workType = detectWorkType(title, description, location);
    const level = detectLevel(title, description);
    const opportunityType = detectOpportunityType(title, description);

    return {
      id: job.id,
      title,
      company: job.company?.display_name || "Company not listed",
      location,
      state: allowedStates.includes(detectedState) ? detectedState : "Remote",
      category,
      workType,
      level,
      opportunityType,
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

    for (const state of allowedStates) {
      for (const group of searchGroups) {
        for (const term of group.terms) {
          const jobs = await fetchAdzunaJobs(term, state, group.category);
          allJobs.push(...jobs);
        }
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