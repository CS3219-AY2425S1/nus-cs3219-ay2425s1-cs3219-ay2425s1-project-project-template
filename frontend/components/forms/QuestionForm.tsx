"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";

import { Question } from "@/types/questions";
import { getAllQuestionTopics } from "@/utils/questions";

interface QuestionFormProps {
  formType: string;
  initialData?: Question;
  onSubmit: (data: Question) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  formType,
  initialData,
  onSubmit,
}) => {
  const router = useRouter();

  const [questionTitle, setQuestionTitle] = useState<string>(
    initialData ? initialData.title : "",
  );
  const [questionDifficulty, setQuestionDifficulty] = useState<string>("");
  const [questionTopics, setQuestionTopics] = useState<string[]>([]);
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const allQuestionTopics = getAllQuestionTopics();

  const handleQuestionDifficultyChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setQuestionDifficulty(e.target.value);
  };

  const handleQuestionTopicsChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setQuestionTopics(e.target.value.split(","));
  };

  const isValid = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (!questionTitle) {
      newErrors.questionTitle = true;
    }

    if (!questionDifficulty) {
      newErrors.questionDifficulty = true;
    }

    if (questionTopics.length === 0) {
      newErrors.questionTopics = true;
    }

    if (!questionDescription) {
      newErrors.questionDescription = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!isValid()) {
      return;
    }

    // Prepare the data and pass it to the onSubmit function
    const questionData = {
      title: questionTitle,
      complexity: questionDifficulty,
      category: questionTopics,
      description: questionDescription,
    };

    onSubmit(questionData as Question);
  };


  return (
    <>
      <h2 className="text-4xl font-bold mb-4">{formType} Question</h2>
      <div className="flex mb-4">
        <p className="basis-1/4 self-end">Question Title</p>
        <Input
          errorMessage="Please input a question title."
          isInvalid={!!errors.questionTitle}
          isRequired={true}
          label="Input Question Title"
          value={questionTitle}
          variant="underlined"
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
      </div>
      <div className="flex mb-4">
        <p className="basis-1/4 self-end">Question Difficulty</p>
        <Select
          errorMessage="Please select the question difficulty."
          isInvalid={!!errors.questionDifficulty}
          isRequired={true}
          label="Select Difficulty"
          selectedKeys={[questionDifficulty]}
          variant="underlined"
          onChange={handleQuestionDifficultyChange}
        >
          <SelectItem key="Easy">Easy</SelectItem>
          <SelectItem key="Medium">Medium</SelectItem>
          <SelectItem key="Hard">Hard</SelectItem>
        </Select>
      </div>
      <div className="flex mb-4">
        <p className="basis-1/4 self-end">Question Topics</p>
        <Select
          errorMessage="Please select a topic."
          isInvalid={!!errors.questionTopics}
          isRequired={true}
          label="Select Topics"
          selectionMode="multiple"
          value={questionTopics}
          variant="underlined"
          onChange={handleQuestionTopicsChange}
        >
          {allQuestionTopics.map((topic) => (
            <SelectItem key={topic}>{topic}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex mb-4">
        <Textarea
          errorMessage="Please provide the question description."
          isInvalid={!!errors.questionDescription}
          label="Input Question Description"
          value={questionDescription}
          onChange={(e) => setQuestionDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button color="danger" onClick={() => router.push("/questions")}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Add
        </Button>
      </div>
    </>
  );
};

export default QuestionForm;
