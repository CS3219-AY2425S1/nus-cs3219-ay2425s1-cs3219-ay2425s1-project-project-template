"use client";

import { useAuth } from "@/app/auth/auth-context";
import QuestionTable from "@/components/questions/questions-table";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Question, QuestionArraySchema } from "@/lib/schemas/question-schema";
import LoadingScreen from "@/components/common/loading-screen";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionFilter from "./question-filter";

const fetcher = async (url: string): Promise<Question[]> => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  const data = await response.json();

  return QuestionArraySchema.parse(data.questions);
};

export default function QuestionListing() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [complexity, setComplexity] = useState(
    searchParams.get("complexity") || ""
  );
  const { data, isLoading } = useSWR(
    `http://localhost:8000/questions?category=${encodeURIComponent(category)}&complexity=${encodeURIComponent(complexity)}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setQuestions(data ?? []);
  }, [data]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    if (complexity) {
      params.set("complexity", complexity);
    } else {
      params.delete("complexity");
    }
    router.push(`?${params.toString()}`);
  }, [category, complexity, router, searchParams]);

  const handleView = (question: Question) => {
    router.push(`/app/questions/${question.id}`);
  };

  const handleSearchChange = (newSearch: string) => {
    setCategory(newSearch);
  };
  const handleComplexityChange = (newComplexity: string) => {
    if (newComplexity === "all") {
      newComplexity = "";
    }
    setComplexity(newComplexity);
  };

  const handleReset = () => {
    setCategory("");
    router.push("");
  };

  if (isLoading && !data) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Listing</h1>
      <QuestionFilter
        category={category}
        onCategoryChange={handleSearchChange}
        complexity={complexity}
        onComplexityChange={handleComplexityChange}
        onReset={handleReset}
      />
      <QuestionTable
        data={questions}
        isAdmin={auth?.user?.isAdmin ?? false}
        handleView={handleView}
      />
    </div>
  );
}
