"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Radio,
  Dropdown,
  Textarea,
  DropdownMenu,
  DropdownItem,
  RadioGroup,
} from "@nextui-org/react";

type QuestionFormData = {
  title: string;
  topics: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
};

const AddQuestionForm: React.FC = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<
    "Easy" | "Medium" | "Hard" | null
  >(null);

  const onSubmit = (data: QuestionFormData) => {
    console.log("Form data:", data);
  };

  return (
    <form className="space-y-6">
      {/* Title */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="title">Title</label>
        <Input isClearable id="title" placeholder="Enter the question title" />
      </div>

      {/* Topics (Dropdown) */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="topics">Topic</label>
        <Dropdown>
          <Button variant="flat">
            {topics.length ? topics.join(", ") : "Select topics"}
          </Button>
          <DropdownMenu
            aria-label="Select topics"
            disallowEmptySelection
            selectionMode="multiple"
            selectedKeys={topics}
            onSelectionChange={(keys) => setTopics(Array.from(keys))}
          >
            <DropdownItem key="Dynamic Programming">
              Dynamic Programming
            </DropdownItem>
            <DropdownItem key="Sorting">Sorting</DropdownItem>
            <DropdownItem key="Graph Theory">Graph Theory</DropdownItem>
            {/* Add more topic options here */}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Difficulty */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="difficulty">Difficulty</label>
        <RadioGroup
          id="difficulty"
          orientation="horizontal"
          value={difficulty}
          onChange={setDifficulty}
        >
          <Radio value="Easy" color="success">
            Easy
          </Radio>
          <Radio value="Medium" color="warning">
            Medium
          </Radio>
          <Radio value="Hard" color="danger">
            Hard
          </Radio>
        </RadioGroup>
      </div>

      {/* Description (WYSIWYG or textarea) */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          placeholder="Enter the question description..."
          minRows={5}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button color="danger">Delete</Button>
        <Button color="success" type="submit">
          Save
        </Button>
        <Button color="primary">Done</Button>
      </div>
    </form>
  );
};

export default AddQuestionForm;
