export default async function handler(req, res) {
  const keyword = req.query.keyword || "";
  const location = req.query.location || "United States";

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({
      error: "Missing RAPIDAPI_KEY environment variable",
    });
  }

  const defaultSearches = [
    "software developer",
    "frontend developer",
    "react developer",
    "javascript developer",
    "full stack developer",
    "junior software developer",
    "cybersecurity analyst",
    "entry level cybersecurity analyst",
    "soc analyst",
    "data analyst",
    "junior data analyst",
    "software developer internship",
    "cybersecurity internship",
    "data analyst internship",
    "software developer apprenticeship",
  ];

  const searchTerms = keyword ? [keyword, ...defaultSearches] : defaultSearches;

  function getCategory(title = "", description = "") {
    const text = `${title} ${description}`.toLowerCase();

    if (
      text.includes("cyber") ||
      text.includes("security") ||
      text.includes("soc") ||
      text.includes("siem") ||
      text.includes("incident response")
    ) {
      return "Cybersecurity";
    }

    if (
      text.includes("data analyst") ||
      text.includes("data analytics") ||
      text.includes("data scientist") ||
      text.includes("power bi") ||
      text.includes("tableau") ||
      text.includes("pandas") ||
      text.includes("sql")
    ) {
      return "Data Analytics";
    }

    return "Software Development";
  }

  function getLevel(title = "", description = "") {
    const text = `${title} ${description}`.toLowerCase();

    if (
      text.includes("intern") ||
      text.includes("internship") ||
      text.includes("apprentice") ||
      text.includes("apprenticeship") ||
      text.includes("entry level") ||
      text.includes("junior")
    ) {
      return "Entry Level";
    }

    if (
      text.includes("senior") ||
      text.includes("sr.") ||
      text.includes("principal") ||
      text.includes("lead")
    ) {
      return "Senior Level";
    }

    return "Mid Level";
  }

  async function fetchJSearchJobs(searchTerm) {
    const searchQuery = `${searchTerm} jobs in ${location}`;

    const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(
      searchQuery
    )}&num_pages=3&country=us&date_posted=all&employment_types=FULLTIME,CONTRACTOR,PARTTIME,INTERN`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      return Array.isArray(data.data?.jobs) ? data.data.jobs : [];
    } catch {
      return [];
    }
  }

  try {
    const jobResults = await Promise.all(searchTerms.map(fetchJSearchJobs));
    const rawJobs = jobResults.flat();

    const uniqueJobs = new Map();

    rawJobs.forEach((job) => {
      if (job?.job_id && !uniqueJobs.has(job.job_id)) {
        uniqueJobs.set(job.job_id, job);
      }
    });

    const jobs = Array.from(uniqueJobs.values()).map((job) => {
      const title = job.job_title || "Untitled Job";
      const description = job.job_description || "No description available.";

      return {
        id: String(job.job_id),
        title,
        company: job.employer_name || "Unknown Company",
        location: job.job_is_remote
          ? "Remote"
          : job.job_location || "United States",
        category: getCategory(title, description),
        level: getLevel(title, description),
        type: job.job_employment_type || "Full-time",
        salary:
          job.job_salary_string ||
          (job.job_min_salary && job.job_max_salary
            ? `$${Math.round(job.job_min_salary).toLocaleString()} - $${Math.round(
                job.job_max_salary
              ).toLocaleString()}`
            : ""),
        description,
        applyUrl: job.job_apply_link || job.job_google_link || "#",
        postedDate:
          job.job_posted_at ||
          job.job_posted_at_datetime_utc ||
          "Recently posted",
        source: job.job_publisher || "JSearch",
        logo: job.employer_logo || "",
        employerWebsite: job.employer_website || "",
      };
    });

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch JSearch jobs",
      details: error.message,
    });
  }
}