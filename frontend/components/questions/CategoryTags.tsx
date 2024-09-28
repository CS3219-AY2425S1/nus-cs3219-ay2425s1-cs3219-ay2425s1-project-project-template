const CATEGORY_TAG_COLORS: { [key: string]: string } = {
  strings: "bg-[#8FBC8F]",
  "data structures": "bg-[#483D8B]",
  algorithms: "bg-[#F5F5DC]",
};

interface CategoryTagsProps {
  questionId: string;
  categories: string[];
}
export default function CategoryTags({
  questionId,
  categories,
}: CategoryTagsProps) {
  return (
    <ul className="flex gap-3 justify-left flex-wrap">
      {categories.map((category) => (
        <li
          key={questionId + category}
          className={`py-1 px-2 rounded-md text-black ${CATEGORY_TAG_COLORS[category.trim().toLocaleLowerCase()]}`}
        >
          <p className="capitalize">{category}</p>
        </li>
      ))}
    </ul>
  );
}
