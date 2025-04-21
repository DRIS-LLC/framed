"use client";

import { Container } from "@/components/container";
import { Button as DrisButton } from "@/components/dris/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSearch } from "@/providers/search";
import { AlumniDetail } from "@/types/alumni";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailSheet from "./detail-sheet";

const steps = [
  {
    label: "Generating query from search",
    description: "This may take a while...",
  },
  {
    label: "Indexing alumni profiles",
    description: "This may take a while...",
  },
  {
    label: "Generating relevant keywords",
    description: "This may take a while...",
  },
  {
    label: "Searching for alumni",
    description: "This may take a while...",
  },
  {
    label: "Your results",
    description: "This may take a while...",
  },
] as const;

type SearchResults = {
  alumniCount: number;
  results: {
    keywords: string[];
  };
  relevantAlumni: {
    alumni: Array<{
      name: string;
      linkedinUrl: string;
      description: string;
      headline: string;
      location: string;
      experience: string;
    }>;
  };
};

function Step({
  step,
  isActive,
  isComplete,
  customDescription,
}: {
  step: (typeof steps)[number];
  isActive: boolean;
  isComplete: boolean;
  customDescription?: string;
}) {
  return (
    <motion.div
      className={`flex flex-col gap-2 opacity-50`}
      initial={{ opacity: 0, height: 0, y: 10 }}
      animate={{
        opacity: isActive || isComplete ? 1 : 0.5,
        height: "auto",
        y: 0,
      }}
      transition={{ duration: 0.5 }}
      key={step.label}
    >
      <motion.h2
        className="text-md font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive || isComplete ? 1 : 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {step.label}
      </motion.h2>
      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive || isComplete ? 1 : 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {customDescription || step.description}
      </motion.p>
    </motion.div>
  );
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [isSearching, setIsSearching] = useState(false);
  const [defaultQuery, setDefaultQuery] = useState(searchQuery);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepDescriptions, setStepDescriptions] = useState<{ [key: number]: string }>({});
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  // const { getToken } = useAuth();

  console.log(searchResults);

  const router = useRouter();

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      setCurrentStep(0);
      setError(null);
      setStepDescriptions({
        0: "Analyzing your query to optimize search parameters...",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCompletedSteps((prev) => [...prev, 0]);

      const response = await fetch(`${BACKEND_URL}/search/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${await getToken()}`,
          credentials: "include",
        },
        body: JSON.stringify({
          query: defaultQuery,
          schoolId: user?.unsafeMetadata.schoolId || "cm9pxeayk0000yh19tbk421qq",
          linkedinUrl: user?.unsafeMetadata.linkedinUrl || "https://www.linkedin.com/in/driselamri",
        }),
      });

      const responseData = (await response.json()) as { data: SearchResults };
      const data = responseData.data;
      setSearchResults(data);

      if (!data || !data.results) {
        throw new Error("Invalid response data");
      }

      setCurrentStep(1);
      setStepDescriptions((prev) => ({
        ...prev,
        1: `Searching through ${data.alumniCount || 0} alumni in our database...`,
      }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCompletedSteps((prev) => [...prev, 1]);

      setCurrentStep(2);
      if (data.results?.keywords?.length) {
        setStepDescriptions((prev) => ({
          ...prev,
          2: `Generated ${data.results.keywords.length} relevant keywords: ${data.results.keywords
            .slice(0, 3)
            .join(", ")}${data.results.keywords.length > 3 ? "..." : ""}`,
        }));
      } else {
        setStepDescriptions((prev) => ({
          ...prev,
          2: "No relevant keywords were generated",
        }));
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCompletedSteps((prev) => [...prev, 2]);

      setCurrentStep(3);
      const relevantAlumni = Array.isArray(data.relevantAlumni)
        ? data.relevantAlumni
        : data.relevantAlumni?.alumni || [];
      const relevantCount = relevantAlumni.length;
      setStepDescriptions((prev) => ({
        ...prev,
        3:
          relevantCount > 0
            ? `Found ${relevantCount} alumni matching your search criteria`
            : "No matching alumni found for your search criteria",
      }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCompletedSteps((prev) => [...prev, 3]);

      setCurrentStep(4);
      setStepDescriptions((prev) => ({
        ...prev,
        4: `Displaying your ${data.relevantAlumni?.alumni?.length || 0} matching results:`,
      }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCompletedSteps((prev) => [...prev, 4]);

      console.log(data);
    } catch (error) {
      console.error(error);

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }

      setError(errorMessage);

      // Reset to single error step
      setCurrentStep(0);
      setCompletedSteps([]);
      setStepDescriptions({
        0: `Error: ${errorMessage}. Please try again.`,
      });
    } finally {
      // REMOVE the reset code from finally block - it's erasing your results
      setIsSearching(false);
      // Don't reset steps and descriptions here!
      // setStepDescriptions({});
      // setCurrentStep(0);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      router.push("/");
      return;
    }

    setDefaultQuery(searchQuery);
    setSearchQuery("");
    handleSearch();
  }, []);

  return (
    <Container>
      <div className="w-full relative -mt-12">
        <Textarea
          className="w-full p-5 resize-none h-36 bg-background/50 backdrop-blur-sm no-scrollbar overflow-auto disabled:opacity-50"
          defaultValue={defaultQuery}
          disabled={isSearching}
          required
        />
        <div className={cn("absolute bottom-4 right-4")}>
          <DrisButton
            size="icon"
            variant="lilac"
            rounded="lg"
            type="submit"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {error ? (
              <ArrowRightIcon className="animate-pulse" />
            ) : isSearching ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ArrowRightIcon />
            )}
          </DrisButton>
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-8">
        {steps.map((step, index) => (
          <Step
            key={step.label}
            step={step}
            isActive={currentStep === index}
            isComplete={completedSteps.includes(index)}
            customDescription={stepDescriptions[index]}
          />
        ))}

        {completedSteps.includes(4) && (
          <motion.div
            className="space-y-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {(Array.isArray(searchResults?.relevantAlumni)
              ? searchResults?.relevantAlumni
              : searchResults?.relevantAlumni?.alumni || []
            ).map((alumni, index) => (
              <motion.div
                key={alumni.linkedinUrl}
                className="flex items-center justify-between p-4 border border-input rounded-lg bg-background/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                <div className="flex flex-col">
                  <Link href={alumni.linkedinUrl} target="_blank" className="text-md font-medium hover:underline">
                    {alumni.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{alumni.description}</p>
                </div>
                <DetailSheet alumni={alumni as AlumniDetail} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Container>
  );
}
