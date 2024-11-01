import { ColumnDef, Row } from "@tanstack/react-table";
import { IDictionary, isSubset } from "../../../lib/utils";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Difficulty } from "@/models/Question";
import moment from "moment";
import { QuestionHistory } from "@/models/QuestionHistory";
import QuestionHistoryDialog from "../QuestionHistory/QuestionHistoryDialog";

const difficultyLevels: IDictionary<number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const difficultySort = (
  rowA: Row<QuestionHistory>,
  rowB: Row<QuestionHistory>
) => {
  const diffA: string = rowA.getValue("difficulty");
  const diffB: string = rowB.getValue("difficulty");
  return difficultyLevels[diffA] - difficultyLevels[diffB];
};

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

export const columns = (): ColumnDef<QuestionHistory>[] => [
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topics" />
    ),
    id: "topics",
    accessorFn: (row) => row.topics.join(", "), // accessorFn is a function that takes a row and returns the value for that column
    enableGlobalFilter: false,
    filterFn: (row, id, filterValue) => {
      const cellValue: string = row.getValue(id);
      const topics = new Set(cellValue.split(", "));
      const filterTopics = new Set(filterValue);

      return isSubset(filterTopics, topics);
    },
  },
  {
    id: "dateAttempted",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="No." />
      </div>
    ),
    accessorKey: "dateAttempted",
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        {String(row.index + 1)}
      </div>
    ),
    size: 30,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Questions" />
    ),
    accessorKey: "title",
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1">
          <QuestionHistoryDialog questionHistory={row.original} />
        </div>
      );
    },
    size: 100,
  },
  {
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Difficulty" />
      </div>
    ),
    accessorKey: "difficulty",
    sortingFn: difficultySort,

    cell: ({ row }) => {
      const difficulty: Difficulty = row.getValue("difficulty");
      return (
        <div
          className={`flex justify-center rounded-lg items-center ${getDifficultyClass(
            difficulty
          )}`}
        >
          <span className={`py-1 font-bold text-xs`}>{difficulty}</span>
        </div>
      );
    },
    size: 40,
  },
  {
    id: "dateAttempted",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="Date Attempted" />
      </div>
    ),
    accessorKey: "dateAttempted",
    cell: ({ row }) => {
      const dateAttempted: string = row.getValue("dateAttempted");

      return (
        <div className="flex justify-center items-center h-full">
          {moment(dateAttempted).fromNow()}
        </div>
      );
    },
    size: 50,
  },
];
