import { useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { Question } from "../Question/question";

interface DataTableProps {
  onSelectQuestion: (question: Question) => void;
}

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const DataTable: React.FC<DataTableProps> = ({ onSelectQuestion }) => {
  // Sample data to populate the table
  const sampleQuestions: Question[] = [
    {
      qid: 1,
      title: "Sort Array",
      complexity: "Easy",
      categories: ["Array"],
      description: "Sample Description for Sort Array",
    },
    {
      qid: 2,
      title: "Reverse String",
      complexity: "Medium",
      categories: ["Strings"],
      description: "Sample Description for Reverse String",
    },
  ];
  const columns = useMemo<MRT_ColumnDef<Question>[]>(
    () => [
      {
        accessorKey: "qid",
        header: "Id",
        size: 100,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 200,
      },
      {
        accessorKey: "complexity",
        header: "Complexity",
        size: 200,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue<string>() === "Easy"
                  ? theme.palette.success.dark
                  : cell.getValue<string>() === "Medium"
                  ? theme.palette.warning.dark
                  : theme.palette.error.dark,
              borderRadius: "0.25rem",
              color: "white",
              padding: "0.25rem",
            })}
          >
            {cell.getValue<string>()}
          </Box>
        ),
      },
      {
        accessorKey: "categories",
        header: "Categories",
        size: 300,
        Cell: ({ cell }) => cell.getValue<string[]>().join(", "),
      },
    ],
    []
  );

  const handleRowClick = (row: MRT_Row<Question>) => {
    onSelectQuestion(row.original); // Pass selected question up to the parent component
  };

  return (
    <ThemeProvider theme={theme}>
      <MaterialReactTable
        columns={columns}
        data={sampleQuestions} // Use the fetched data here
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => handleRowClick(row),
          style: { cursor: "pointer" },
        })}
      />
    </ThemeProvider>
  );
};

export default DataTable;
