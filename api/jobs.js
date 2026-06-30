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

  const searchQuery = `${keyword} in ${location}`;

  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
    searchQuery
  )}&page=${page}&num_pages=1&country=us&date_posted=month`;

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

    const jobs = (data.data || []).map((job) => ({
      id: String(job.job_id || crypto.randomUUID()),
      title: job.job_title || "Untitled Job",
      company: job.employer_name || "Unknown Company",
      location:
        job.job_city && job.job_state
          ? `${job.job_city}, ${job.job_state}`
          : job.job_country || "Remote",
      category: "Technology",
      level: "Entry Level",
      type: job.job_employment_type || "Full-time",
      salary:
        job.job_min_salary && job.job_max_salary
          ? `$${Math.round(job.job_min_salary).toLocaleString()} - $${Math.round(
              job.job_max_salary
            ).toLocaleString()}`
          : "",
      description: job.job_description || "No description available.",
      applyUrl: job.job_apply_link || job.job_google_link || "#",
      postedDate: job.job_posted_at_datetime_utc || "Recently posted",
    }));

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch JSearch jobs",
      details: error.message,
    });
  }
}