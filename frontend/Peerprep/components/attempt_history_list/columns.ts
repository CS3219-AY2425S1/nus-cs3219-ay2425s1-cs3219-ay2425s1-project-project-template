import type { ColumnDef } from "@tanstack/vue-table";
import type { User } from "~/types/User";

export const getColumns = (refreshData: () => void): ColumnDef<User>[] => [
  { accessorKey: "index", header: "Index" },
  { accessorKey: "questionTitle", header: "Question Title" },
  { accessorKey: "questionDifficulty", header: "Question Difficulty" },
  { accessorKey: "questionCategory", header: "Category"},
  { accessorKey: "dateTime", header: "Date/Time"},
  { accessorKey: "matchedUser", header: "Matched User" },
];
