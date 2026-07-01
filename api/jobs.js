export default async function handler(req, res) {
  const keyword = req.query.keyword || "software developer";
  const location = req.query.location || "United States";
  const page = req.query.page || "1";

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({
      error: "Missing RAPIDAPI_KEY environment variable",
    });
  }

  const searchQuery = `${keyword} jobs in ${location}`;

  const url = `https://jsearch.p.rapidapi.com/search-basic?query=${encodeURIComponent(
    searchQuery
  )}&page=${page}&num_pages=1&country=us&date_posted=all`;

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

    const jobs = rawJobs.map((job) => ({
      id: String(job.job_id),
      title: job.job_title || "Untitled Job",
      company: job.employer_name || "Unknown Company",
      location: job.job_location || "Remote",
      category: "Technology",
      level: "Entry Level",
      type: job.job_employment_type || "Full-time",
      salary: job.job_salary_string || "",
      description: job.job_description || "No description available.",
      applyUrl: job.job_apply_link || job.job_google_link || "#",
      postedDate: job.job_posted_at || "Recently posted",
    }));

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch JSearch jobs",
      details: error.message,
    });
  }
}