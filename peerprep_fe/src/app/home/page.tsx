"use client";

import Header from "@/components/common/header";
import { getQuestions } from "@/app/actions/questions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/modal.css";
import { QuestionForm } from "@/components/questions/question-form";
import Button from "@/components/common/button";
import TableRow from "@/components/questions/table-row";

export default function Home() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [addQns, setAddQns] = useState(false);
  const [editQns, setEditQns] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      router.push("/auth/login");
    }
    // // TODO: Validate token is still valid

    getQuestions(token).then((data) => {
      setQuestions(data?.message);
    });
  }, []);

  const toggleAddQns = () => {
    setAddQns(!addQns);
  };

  const toggleEditQns = () => {
    setEditQns(!editQns);
  };

  if (addQns) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div className="h-screen w-screen flex flex-col max-w-6xl mx-auto py-10">
      <Header>
        <Button
          text="Logout"
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
        />
      </Header>
      <Button type="submit" onClick={toggleAddQns} text="Add Question" />
      <table className="min-w-full table-auto bg-white shadow-md mt-4">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Questions</th>
            <th className="py-3 px-6 text-left">Difficulty</th>
            <th className="py-3 px-6 text-left">Topics</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {questions.map((question, index) => {
            return (
              <TableRow
                id={question.id}
                title={question.title}
                difficulty={question.difficultyLevel}
                topics={question.topic}
                key={index}
                onClickEdit={toggleEditQns}
              />
            );
          })}
        </tbody>
      </table>
      {addQns && (
        <div className="modal">
          <div onClick={toggleAddQns} className="overlay"></div>
          <div className="modal-content">
            <QuestionForm />
            <Button type="reset" onClick={toggleAddQns} text="CLOSE" />
          </div>
        </div>
      )}
      {editQns && (
        <div className="modal">
          <div onClick={toggleEditQns} className="overlay"></div>
          <div className="modal-content">
            <QuestionForm />
            <Button type="reset" onClick={toggleEditQns} text="CLOSE" />
          </div>
        </div>
      )}
    </div>
  );
}

export async function logout() {
  localStorage.removeItem("token");
}
