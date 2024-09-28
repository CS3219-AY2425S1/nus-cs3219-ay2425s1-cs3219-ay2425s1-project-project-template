"use client";

import LargeTextfield from "@/components/common/large-text-field";
import Button from "@/components/common/button";
import type { FormRequest } from "@/app/actions/questions";

export enum FormType {
  EDIT = "Edit",
  ADD = "Add",
}

export function QuestionForm({
  state,
  onSubmit,
  type,
}: {
  state?: QuestionDto;
  onSubmit: any;
  type: FormType;
}) {
  // Tracks the form submission state
  const token = localStorage.getItem("token");
  const action = onSubmit.bind(null, token);

  return (
    <div>
      <h1 className="font-bold text-slate-200 dark:text-slate-700">
        {type} Question
      </h1>
      <form action={action}>
        {/* Input for question title */}
        <div>
          <LargeTextfield
            name="title"
            secure={false}
            placeholder_text="Title"
            text={state?.title}
          />
        </div>

        {/* Input for question description */}
        <div>
          <LargeTextfield
            name="description"
            secure={false}
            placeholder_text="Description"
            text={state?.description}
          />
        </div>

        {/* Input for difficulty level (Easy, Medium, Hard) */}
        <select
          name="difficultyLevel"
          className="bg-slate-200 dark:bg-slate-700 rounded-lg w-full h-16 p-4 my-3 focus:outline-none"
          defaultValue={state?.difficultyLevel}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Input for topics (comma-separated) */}
        <div>
          <LargeTextfield
            name="topic"
            secure={false}
            placeholder_text="Topics (comma-separated, e.g., Array, Hash Table)"
            text={state?.topic?.join(", ")}
          />
        </div>

        {/* Input for examples (separated by semicolons and pipes) */}
        <div>
          <LargeTextfield
            name="examples"
            secure={false}
            placeholder_text="Examples (input|output|explanation; e.g., nums=[2,7,11,15], target=9|[0,1]|Because nums[0] + nums[1] == 9)"
            text={state?.examples?.join("|")}
          />
        </div>

        {/* Input for constraints (semicolon-separated) */}
        <div>
          <LargeTextfield
            name="constraints"
            secure={false}
            placeholder_text='Constraints (semicolon-separated, e.g., "2 <= nums.length <= 10^4; -10^9 <= nums[i] <= 10^9")'
            text={state?.constraints?.join("; ")}
          />
        </div>

        {/* Submit button */}
        <Button type="submit" text={`${type} Question`} />
      </form>
    </div>
  );
}
