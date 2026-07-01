export default async function handler(req, res) {
  const keyword =
    req.query.keyword || "software developer cybersecurity data analytics";
  const location = req.query.location || "United States";
  const page = req.query.page || "1";

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({
      error: "Missing RAPIDAPI_KEY environment variable",
    });
  }

  const searchQuery = `${keyword} jobs in ${location}`;

  const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(
    searchQuery
  )}&page=${page}&num_pages=1&country=us&date_posted=all&work_from_home=true&employment_types=FULLTIME,CONTRACTOR,PARTTIME,INTERN`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: "JSearch request failed",
        details: errorText,
      });
    }

    const data = await response.json();
    const rawJobs = Array.isArray(data.data?.jobs) ? data.data.jobs : [];

    const jobs = rawJobs.map((job) => {
      const title = job.job_title || "Untitled Job";

      return {
        id: String(job.job_id),
        title,
        company: job.employer_name || "Unknown Company",
        location: job.job_is_remote
          ? "Remote"
          : job.job_location || "United States",
        category: title.toLowerCase().includes("cyber")
          ? "Cybersecurity"
          : title.toLowerCase().includes("data")
          ? "Data Analytics"
          : "Software Development",
        level: title.toLowerCase().includes("senior")
          ? "Senior Level"
          : title.toLowerCase().includes("junior") ||
            title.toLowerCase().includes("entry") ||
            title.toLowerCase().includes("intern")
          ? "Entry Level"
          : "Mid Level",
        type: job.job_employment_type || "Full-time",
        salary:
          job.job_salary_string ||
          (job.job_min_salary && job.job_max_salary
            ? `$${Math.round(job.job_min_salary).toLocaleString()} - $${Math.round(
                job.job_max_salary
              ).toLocaleString()}`
            : ""),
        description: job.job_description || "No description available.",
        applyUrl: job.job_apply_link || job.job_google_link || "#",
        postedDate: job.job_posted_at || "Recently posted",
        source: job.job_publisher || "JSearch",
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