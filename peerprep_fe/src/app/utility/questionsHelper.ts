import { QuestionForm } from "@/components/questions/question-form";
import { QuestionDto } from "peerprep-shared-types";

const prepareFormDataForSubmission = (
  formData: QuestionForm
): Omit<QuestionDto, "_id"> | { error: string } => {
  // Validate title and description
  if (!formData.title.trim() || !formData.description.trim()) {
    return { error: "Title and description are required." };
  }

  // Validate and process topic
  const topics = formData.topic
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "");
  if (topics.length === 0) {
    return { error: "At least one topic is required." };
  }

  // Validate and process examples
  const exampleEntries = formData.examples.filter((ex) => ex.trim() !== "");

  const processedExamples: {
    input: string;
    output: string;
    explanation?: string;
  }[] = [];

  for (const ex of exampleEntries) {
    const parts = ex.split("|").map((part) => part.trim());
    if (parts.length < 2 || parts.length > 3) {
      return {
        error: `Invalid example format: ${ex}. Examples (input|output|explanation; e.g., nums=[2,7,11,15], target=9|[0,1]|Because nums[0] + nums[1] == 9)`,
      };
    }
    processedExamples.push({
      input: parts[0],
      output: parts[1],
      explanation: parts[2],
    });
  }

  // Validate and process constraints
  const constraints = formData.constraints;

  try {
    return {
      title: formData.title.trim(),
      description: formData.description.trim(),
      difficultyLevel: formData.difficultyLevel,
      topic: topics,
      examples: processedExamples,
      constraints: constraints,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export default prepareFormDataForSubmission;
