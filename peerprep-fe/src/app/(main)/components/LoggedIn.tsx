import FilterBar from "./Filter/FilterBar";
import ProblemTable from "./ProblemTable";

export default function LoggedIn() {
  return (
    <div className="min-h-screen pt-24 bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <FilterBar />
        <ProblemTable problems={problems} />
      </div>
    </div>
  );
}

// TODO: replace with backend-fetched data
const problems = [
  {
    status: "attempted",
    title: "2220. Minimum Bit Flips to Convert Number",
    topics: ["Bit Manipulation"],
    difficulty: "Easy",
    difficultyColor: "text-green-500",
  },
  {
    status: "solved",
    title: "1. Two Sum",
    topics: ["Array", "Hash Table"],
    difficulty: "Easy",
    difficultyColor: "text-green-500",
  },
  {
    status: "unsolved",
    title: "2. Add Two Numbers",
    topics: ["Linked List", "Math"],
    difficulty: "Medium",
    difficultyColor: "text-yellow-500",
  },
  {
    status: "solved",
    title: "3. Longest Substring Without Repeating Characters",
    topics: ["Hash Table", "String", "Sliding Window"],
    difficulty: "Medium",
    difficultyColor: "text-yellow-500",
  },
  {
    status: "unsolved",
    title: "4. Median of Two Sorted Arrays",
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    difficulty: "Hard",
    difficultyColor: "text-red-500",
  },
  {
    status: "unsolved",
    title: "5. Longest Palindromic Substring",
    topics: ["String", "Dynamic Programming"],
    difficulty: "Medium",
    difficultyColor: "text-yellow-500",
  },
  {
    status: "unsolved",
    title: "6. Zigzag Conversion",
    topics: ["String"],
    difficulty: "Medium",
    difficultyColor: "text-yellow-500",
  },
  {
    status: "unsolved",
    title: "7. Reverse Integer",
    topics: ["Math"],
    difficulty: "Medium",
    difficultyColor: "text-yellow-500",
  },
  {
    status: "unsolved",
    title: "8. String to Integer (atoi)",
    topics: ["String", "Math"],
    difficulty: "Medium",
    difficultyColor: "text-yellow-500",
  },
  {
    status: "solved",
    title: "9. Palindrome Number",
    topics: ["Math"],
    difficulty: "Easy",
    difficultyColor: "text-green-500",
  },
];
