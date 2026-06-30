export type Job = {
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
  applicationStatus?: string;
};

export async function getRealJobs(searchTerm?: string, location = "United States"): Promise<Job[]> {
 const response = await fetch(
  `/api/jobs?keyword=${encodeURIComponent(searchTerm || "software developer")}&location=${encodeURIComponent(
    location
  )}`
 );

  if (!response.ok) {
    throw new Error("Failed to load real jobs.");
  }

  const data = await response.json();

  return data.jobs || [];
}