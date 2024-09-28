"use client";
import { useState, ChangeEvent, MouseEvent, FormEvent } from "react";
import { QuestionBody, Difficulty, QuestionFullBody } from "@/api/structs";
import { addQuestion } from "@/api/gateway";

type Props = {};

interface Mapping {
  key: string;
  value: string;
}

function NewQuestion({}: Props) {
  const [testCases, setTestCases] = useState<Mapping[]>([
    {
      key: "",
      value: "",
    },
  ]);
  const [formData, setFormData] = useState<QuestionBody>({
    title: "",
    difficulty: Difficulty.Easy,
    description: "",
    categories: [],
  });

  const handleTextInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleTestCaseInput = (
    e: ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const values = [...testCases];
    values[idx] = {
      ...values[idx],
      [e.target.name]: e.target.value,
    };
    setTestCases(values);
  };

  const handleAddField = (e: MouseEvent<HTMLElement>) =>
    setTestCases([...testCases, { key: "", value: "" }]);

  const handleDeleteField = (e: MouseEvent<HTMLElement>, idx: number) => {
    const values = [...testCases];
    values.splice(idx, 1);
    setTestCases(values);
  };

  const handleSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question: QuestionFullBody = {
      ...formData,
      test_cases: testCases
        .map((elem: Mapping) => ({
          [elem.key]: elem.value,
        }))
        .reduce((res, item) => ({ ...res, ...item }), {}),
    };
    const status = await addQuestion(question);
    if (status.error) {
      console.log("Failed to add question.");
      console.log(`Code ${status.status}:  ${status.error}`);
      return;
    }
    console.log(`Successfully added the question.`);
  };

  return (
    <div>
      <form
        style={{ color: "black", padding: "5px" }}
        onSubmit={handleSubmission}
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleTextInput}
        />
        <br />
        <input
          type="radio"
          id="easy"
          name="difficulty"
          value={1}
          onChange={handleTextInput}
        />
        <label htmlFor="easy">Easy</label>
        <br />
        <input
          type="radio"
          id="med"
          name="difficulty"
          value={2}
          onChange={handleTextInput}
        />
        <label htmlFor="med">Medium</label>
        <br />
        <input
          type="radio"
          id="hard"
          name="difficulty"
          value={3}
          onChange={handleTextInput}
        />
        <label htmlFor="hard">Hard</label>
        <br />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleTextInput}
        />
        <br />
        {testCases.map((elem, idx) => (
          <>
            <input
              name="key"
              type="text"
              id={`key_${idx.toLocaleString()}`}
              value={elem.key}
              onChange={(e) => handleTestCaseInput(e, idx)}
            />
            <input
              name="value"
              type="text"
              id={`val_${idx.toLocaleString()}`}
              value={elem.value}
              onChange={(e) => handleTestCaseInput(e, idx)}
            />
            <input
              type="button"
              name="del_entry"
              value="Delete..."
              onClick={(e) => handleDeleteField(e, idx)}
              style={{ backgroundColor: "white" }}
            />
            <br />
          </>
        ))}
        <input
          type="button"
          name="add_entry"
          value="Add..."
          onClick={handleAddField}
          style={{ backgroundColor: "white" }}
        />
        <button
          type="submit"
          name="submit"
          style={{ backgroundColor: "white" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewQuestion;
