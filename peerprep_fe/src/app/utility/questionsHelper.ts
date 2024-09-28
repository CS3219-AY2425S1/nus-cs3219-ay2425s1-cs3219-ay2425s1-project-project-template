export function parseFormData(formData: FormData) {
  const getStringValue = (value: FormDataEntryValue | null): string => {
    return typeof value === "string" ? value : "";
  };

  // Parse form data into the correct format
  const topics = getStringValue(formData.get("topic"))
    .split(",")
    .map((item) => item.trim());

  const examples = getStringValue(formData.get("examples"))
    .split(";")
    .map((item) => {
      const [input, output, explanation] = item.split("|");
      return {
        input: input.trim(),
        output: output.trim(),
        explanation: explanation ? explanation.trim() : undefined,
      };
    });

  const constraints = getStringValue(formData.get("constraints"))
    .split(";")
    .map((item) => item.trim());

  // Prepare the data to be sent
  const data = {
    title: getStringValue(formData.get("title")),
    description: getStringValue(formData.get("description")),
    difficultyLevel: getStringValue(formData.get("difficultyLevel")), // Should be validated on the frontend to be one of "Easy", "Medium", or "Hard"
    topic: topics,
    examples: examples,
    constraints: constraints,
  };

  return data;
}
