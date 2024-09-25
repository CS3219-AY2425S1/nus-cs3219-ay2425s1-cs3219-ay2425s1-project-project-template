"use client";
import QuestionsTable from "@/components/questionstable";
import Questions from "../mockdata/sample_getAllQuestions.json";
import { categoryOptions, setCategoryOptions } from "./columns";

export default async function QuestionsPage() {
  let questions = Questions.questions;

  const allCategories = questions.flatMap((question) => question.category);
  const uniqueCategories = Array.from(new Set(allCategories));

  setCategoryOptions(uniqueCategories);

  return (
    <div>
      <QuestionsTable questions={questions} />
    </div>
  );
}
