export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  level: string;
  type: string;
  salary?: string;
  description: string;
  applyUrl?: string;
  postedDate?: string;
  source?: string;
};

export async function getRealJobs(
  searchTerm = "software developer",
  location = "United States"
): Promise<Job[]> {
  const response = await fetch(
    `/api/jobs?keyword=${encodeURIComponent(
      searchTerm
    )}&location=${encodeURIComponent(location)}`
  );

  if (!response.ok) {
    throw new Error("Failed to load real jobs.");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}