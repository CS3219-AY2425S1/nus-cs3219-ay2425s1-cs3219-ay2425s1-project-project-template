import { getAllQuestionCategories } from "../../utils/questions";

const COLORS = [
  "#A3B1C6", // Soft blue-gray
  "#B8B8AA", // Muted beige
  "#D1D5DB", // Light grayish-blue
  "#E2E8F0", // Light sky blue
  "#CBD5E1", // Muted light gray
  "#F3F4F6", // Very light grayish-blue
  "#94A3B8", // Slate gray
  "#9CA3AF", // Neutral gray
  "#E5E7EB", // Light gray
  "#F5F5F5", // Soft white-gray
  "#D1D1D1", // Muted silver
  "#ECECEC", // Very light silver
  "#B0BEC5", // Light steel blue
  "#D3D3D3", // Light silver
  "#C9C9C9", // Soft gray
  "#F0F0F0", // Soft grayish white
  "#AAB8C2", // Neutral light gray-blue
  "#BDC3C7", // Light stone gray
  "#B0C4DE", // Light steel blue
  "#D6D6D6", // Soft platinum gray
  "#F1F3F5", // Soft silver white
  "#D8DEE9", // Pale blue-gray
  "#BCCCDC", // Light blue-gray
  "#E0E0E0", // Light ash gray
  "#F8F9FA", // Soft cream
  "#E7EBEF", // Very light blue-gray
  "#DAE1E7", // Soft cool gray
  "#CED4DA", // Cool grayish white
  "#F7FAFC", // Soft white-blue
  "#DFE7EE"  // Light cool gray
];

export const assignColorsToCategories = (): { [key: string]: string } => {
  const categories = getAllQuestionCategories();
  const categoryColors: { [key: string]: string } = {};

  categories.forEach(category => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    categoryColors[category] = randomColor;
  });

  return categoryColors;
};

interface CategoryTagsProps {
  questionId: string;
  categories: string[];
}

// React component to display the colored category tags
export default function CategoryTags({ questionId, categories }: CategoryTagsProps) {
  // Assign colors to categories
  const categoryColors = assignColorsToCategories();

  return (
    <ul className="flex gap-3 justify-left flex-wrap">
      {categories.map((category) => (
        <li
          key={questionId + category}
          className="py-1 px-2 rounded-md text-black"
          style={{ backgroundColor: categoryColors[category] }} // Dynamically set background color
        >
          <p className="capitalize">{category}</p>
        </li>
      ))}
    </ul>
  );
}
