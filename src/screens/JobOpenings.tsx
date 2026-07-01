import { useEffect, useMemo, useState } from "react";
import { getRealJobs, type Job } from "../services/jobsApi";

const categories = [
  "All Categories",
  "Software Development",
  "Cybersecurity",
  "Data Analytics",
];

const levels = ["All Levels", "Entry Level", "Mid Level", "Senior Level"];

const jobTypes = [
  "All Types",
  "Full-time",
  "Part-time",
  "Contractor",
  "Internship",
  "Apprenticeship",
];

type JobStatus = "Saved" | "Applied" | "Interviewing" | "Offer";
type JobTab = "All Jobs" | "Saved" | "Applied" | "Interviewing" | "Offers";

function shortenText(text: string, limit = 220): string {
  if (!text) return "No description available.";
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function organizeDescription(description: string) {
  const text = description || "No description available.";

  const responsibilitiesIndex = text.search(
    /responsibilities|what you'll do|what you will do|key responsibilities/i
  );

  const qualificationsIndex = text.search(
    /qualifications|requirements|about you|what you bring|basic qualifications|preferred qualifications/i
  );

  const overview =
    responsibilitiesIndex > 0
      ? text.slice(0, responsibilitiesIndex).trim()
      : text.slice(0, 700).trim();

  const responsibilities =
    responsibilitiesIndex > -1 && qualificationsIndex > responsibilitiesIndex
      ? text.slice(responsibilitiesIndex, qualificationsIndex).trim()
      : "";

  const qualifications =
    qualificationsIndex > -1
      ? text.slice(qualificationsIndex, qualificationsIndex + 1400).trim()
      : "";

  return {
    overview,
    responsibilities,
    qualifications,
    fullDescription: text,
  };
}

function mergeUniqueJobs(currentJobs: Job[], newJobs: Job[]) {
  const jobMap = new Map<string, Job>();

  [...currentJobs, ...newJobs].forEach((job) => {
    if (job.id) {
      jobMap.set(job.id, job);
    }
  });

  return Array.from(jobMap.values());
}

export default function JobOpenings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [interviewingJobs, setInterviewingJobs] = useState<Job[]>([]);
  const [offerJobs, setOfferJobs] = useState<Job[]>([]);

  const [activeTab, setActiveTab] = useState<JobTab>("All Jobs");

  const [keyword, setKeyword] = useState("software developer");
  const [location, setLocation] = useState("United States");

  const [searchKeyword, setSearchKeyword] = useState("software developer");
  const [searchLocation, setSearchLocation] = useState("United States");

  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pivotSavedJobs");
    const applied = localStorage.getItem("pivotAppliedJobs");
    const interviewing = localStorage.getItem("pivotInterviewingJobs");
    const offers = localStorage.getItem("pivotOfferJobs");

    setSavedJobs(saved ? JSON.parse(saved) : []);
    setAppliedJobs(applied ? JSON.parse(applied) : []);
    setInterviewingJobs(interviewing ? JSON.parse(interviewing) : []);
    setOfferJobs(offers ? JSON.parse(offers) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("pivotSavedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem("pivotAppliedJobs", JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem(
      "pivotInterviewingJobs",
      JSON.stringify(interviewingJobs)
    );
  }, [interviewingJobs]);

  useEffect(() => {
    localStorage.setItem("pivotOfferJobs", JSON.stringify(offerJobs));
  }, [offerJobs]);

  useEffect(() => {
    async function loadJobs() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getRealJobs(keyword, location, 1);

        setJobs(data);
        setSelectedJob(data[0] ?? null);
        setPage(1);
      } catch (error) {
        console.error("Job loading error:", error);
        setJobs([]);
        setSelectedJob(null);
        setErrorMessage("Unable to load jobs right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, [keyword, location]);

  async function loadMoreJobs() {
    try {
      setIsLoadingMore(true);
      setErrorMessage("");

  function addJobToList(job: Job, status: JobStatus) {
    if (!job || !job.id) return;

    const addUnique = (list: Job[], setList: (j: Job[]) => void) => {
      if (list.find((j) => j.id === job.id)) return;
      setList([...list, job]);
    };

    switch (status) {
      case "Saved":
        addUnique(savedJobs, setSavedJobs);
        break;
      case "Applied":
        addUnique(appliedJobs, setAppliedJobs);
        break;
      case "Interviewing":
        addUnique(interviewingJobs, setInterviewingJobs);
        break;
      case "Offer":
        addUnique(offerJobs, setOfferJobs);
        break;
    }
  }

  return <div />;

      setJobs((currentJobs) => mergeUniqueJobs(currentJobs, moreJobs));
      setPage(nextPage);
    } catch (error) {
      console.error("Load more jobs error:", error);
      setErrorMessage("Unable to load more jobs right now.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function addJobToList