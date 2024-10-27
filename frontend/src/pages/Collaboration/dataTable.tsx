import { useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { Question } from "../Question/question";
// import { useGetQuestions } from "./your-fetch-hooks"; // Adjust the import according to your hooks file

interface DataTableProps {
  onSelectQuestion: (question: Question) => void;
}

// Create a theme similar to the one in your main table
const theme = createTheme({
  palette: {
    mode: "dark", // Ensure it matches your existing theme
  },
});

const DataTable: React.FC<DataTableProps> = ({ onSelectQuestion }) => {
  //   const { data: fetchedQuestions = [] } = useGetQuestions(); // Fetch questions

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
        data={[]} // Use the fetched data here
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => handleRowClick(row),
          style: { cursor: "pointer" },
        })}
      />
    </ThemeProvider>
  );
};

export default DataTable;
