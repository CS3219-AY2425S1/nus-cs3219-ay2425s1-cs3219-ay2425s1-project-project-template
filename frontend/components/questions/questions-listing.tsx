"use client";

import { useAuth } from "@/app/auth/auth-context";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Question, QuestionArraySchema } from "@/lib/schemas/question-schema";

import LoadingScreen from "@/components/common/loading-screen";
import QuestionTable from "@/components/questions/questions-table";
import QuestionFilter from "@/components/questions/question-filter";

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

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const { data, isLoading } = useSWR(
    `http://localhost:8000/questions?search=${encodeURIComponent(search)}`,
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
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [search, router, searchParams]);

  const handleView = (question: Question) => {
    router.push(`/app/questions/${question.id}`);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const handleReset = () => {
    setSearch("");
    router.push("");
  };

  if (isLoading && !data) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Listing</h1>
      <QuestionFilter
        search={search}
        onSearchChange={handleSearchChange}
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
