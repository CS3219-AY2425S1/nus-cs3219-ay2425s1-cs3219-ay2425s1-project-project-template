"use client";

import { useAuth } from "@/app/auth/auth-context";
import QuestionTable from "./questions-table";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Question } from "@/lib/schemas/question-schema";
import QuestionViewModal from "./question-view-modal";
import LoadingScreen from "../common/loading-screen";

const fetcher = (url: string) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error(String(res.status));
      }
    }
    return res.json();
  });
};

export default function QuestionListing() {
  const auth = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    "http://localhost:8000/questions/questions",
    fetcher
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [showViewModal, setShowViewModal] = useState<boolean>(false);

  useEffect(() => {
    setQuestions(data?.questions ?? []);
  }, [data]);

  const handleView = (question: Question) => {
    setSelectedQuestion(question);
    setShowViewModal(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Listing</h1>
      <QuestionViewModal
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        data={selectedQuestion}
      />
      <QuestionTable
        data={questions}
        isAdmin={auth?.user?.isAdmin ?? false}
        handleView={handleView}
      />
    </div>
  );
}
