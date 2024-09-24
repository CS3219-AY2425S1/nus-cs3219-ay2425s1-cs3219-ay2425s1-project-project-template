"use client";

import { useAuth } from "@/app/auth/auth-context";
import QuestionTable from "@/components/questions/questions-table";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Question, QuestionArraySchema } from "@/lib/schemas/question-schema";
import LoadingScreen from "@/components/common/loading-screen";
import { useRouter } from "next/navigation";

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
  const { data, isLoading } = useSWR(
    "http://localhost:8000/questions",
    fetcher
  );

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setQuestions(data ?? []);
  }, [data]);

  const handleView = (question: Question) => {
    router.push(`/app/questions/${question.id}`);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Listing</h1>
      <QuestionTable
        data={questions}
        isAdmin={auth?.user?.isAdmin ?? false}
        handleView={handleView}
      />
    </div>
  );
}
