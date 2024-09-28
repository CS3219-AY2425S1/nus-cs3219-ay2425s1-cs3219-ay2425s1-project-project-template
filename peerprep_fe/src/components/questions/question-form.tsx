"use client";

import { useFormState } from "react-dom";
import LargeTextfield from "@/components/common/large-text-field";
import Button from "@/components/common/button";
import { addQuestion } from "@/app/actions/questions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function QuestionForm() {
  // Tracks the form submission state
  const token = localStorage.getItem("token");
  const onSubmit = addQuestion(token);
  const [state, action] = useFormState(onSubmit, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      // Assuming the message contains a token
      localStorage.setItem("token", state.message);
      router.push("/home"); // Redirect to /home on success
    } else if (state?.errors?.errorMessage) {
      // Show error alert if an error occurs
      alert(state.errors.errorMessage);
    }
  }, [state]);

  return (
    <div>
      <h1>Add Question</h1>
      <form action={action}>
        {/* Input for question title */}
        <div>
          <LargeTextfield
            name="title"
            secure={false}
            placeholder_text="Title"
          />
        </div>

        {/* Input for question description */}
        <div>
          <LargeTextfield
            name="description"
            secure={false}
            placeholder_text="Description"
          />
        </div>

        {/* Input for difficulty level (Easy, Medium, Hard) */}
        <div>
          <LargeTextfield
            name="difficultyLevel"
            secure={false}
            placeholder_text="Difficulty Level (Easy, Medium, Hard)"
          />
        </div>

        {/* Input for topics (comma-separated) */}
        <div>
          <LargeTextfield
            name="topic"
            secure={false}
            placeholder_text="Topics (comma-separated, e.g., Array, Hash Table)"
          />
        </div>

        {/* Input for examples (separated by semicolons and pipes) */}
        <div>
          <LargeTextfield
            name="examples"
            secure={false}
            placeholder_text="Examples (input|output|explanation; e.g., nums=[2,7,11,15], target=9|[0,1]|Because nums[0] + nums[1] == 9)"
          />
        </div>

        {/* Input for constraints (semicolon-separated) */}
        <div>
          <LargeTextfield
            name="constraints"
            secure={false}
            placeholder_text='Constraints (semicolon-separated, e.g., "2 <= nums.length <= 10^4; -10^9 <= nums[i] <= 10^9")'
          />
        </div>

        {/* Submit button */}
        <Button type="submit" text="Add Question" />
      </form>
    </div>
  );
}
