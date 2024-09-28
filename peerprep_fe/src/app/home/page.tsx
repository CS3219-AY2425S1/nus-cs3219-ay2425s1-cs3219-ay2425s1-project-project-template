"use client";

import Header from "@/components/common/header";
import { getQuestions } from "@/app/actions/questions";
import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/modal.css";
import { QuestionForm } from "@/components/questions/question-form";
import Button from "@/components/common/button";
import TableRow from "@/components/questions/table-row";
import { useAuth } from "@/contexts/auth-context";
import { editQuestion, addQuestion } from "@/app/actions/questions";
import { FormType } from "@/components/questions/question-form";

enum ModalActionType {
  EDIT,
  ADD,
  CLOSE,
}

interface ModalState {
  isVisible: boolean;
  isDetailShown: boolean;
  details?: QuestionDto;
}

interface ModalAction {
  type: ModalActionType;
  details?: QuestionDto;
}

function modalReducer(state: ModalState, action: ModalAction) {
  const { type, details } = action;

  switch (type) {
    case ModalActionType.EDIT:
      return {
        isVisible: true,
        isDetailShown: true,
        details: details,
      };
    case ModalActionType.ADD:
      return {
        ...state,
        isVisible: true,
        isDetailShown: false,
      };
    case ModalActionType.CLOSE:
      return {
        ...state,
        isVisible: false,
      };
    default:
      throw Error("Unknown action " + type);
  }
}

export default function Home() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [modalState, dispatchModal] = useReducer(modalReducer, {
    isVisible: false,
    isDetailShown: false,
  });
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      console.log(token);
      // // TODO: Validate token is still valid

      getQuestions(token).then((data) => {
        setQuestions(data?.message);
      });
    }
    console.log("No token found");
  }, [token]);

  const onClickAdd = () =>
    dispatchModal({
      type: ModalActionType.ADD,
    });

  const closeModal = () =>
    dispatchModal({
      type: ModalActionType.CLOSE,
    });

  return (
    <div className="h-screen w-screen flex flex-col max-w-6xl mx-auto py-10">
      <Header>
        <Button
          text="Logout"
          onClick={() => {
            router.push("/auth/login");
          }}
        />
      </Header>
      <Button type="submit" onClick={onClickAdd} text="Add Question" />
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
                id={question._id}
                title={question.title}
                difficulty={question.difficultyLevel}
                topics={question.topic}
                key={index}
                onClickEdit={() =>
                  dispatchModal({
                    type: ModalActionType.EDIT,
                    details: question,
                  })
                }
              />
            );
          })}
        </tbody>
      </table>
      {modalState.isVisible && (
        <div className="modal">
          <div onClick={closeModal} className="overlay"></div>
          <div className="modal-content">
            <QuestionForm
              state={modalState.isDetailShown ? modalState.details : undefined}
              onSubmit={
                modalState.isDetailShown
                  ? editQuestion.bind(null, modalState.details!)
                  : addQuestion
              }
              type={modalState.isDetailShown ? FormType.EDIT : FormType.ADD}
            />
            <Button type="reset" onClick={closeModal} text="CLOSE" />
          </div>
        </div>
      )}
    </div>
  );
}
