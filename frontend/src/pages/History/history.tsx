import { useContext, useMemo } from "react";
import { AuthContext } from "../../hooks/AuthContext";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Cell,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  createTheme,
  ThemeProvider,
  type Theme,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

import MainLayout from "../../components/MainLayout";
import { type Question } from "../Question/question";

interface Attempt {
  timestamp: Date,
  qid: Number,
  title: string,
}

const HistoryTable = () => {
  const { user } = useContext(AuthContext);
  const columns = useMemo<MRT_ColumnDef<Attempt>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: "Submitted",
        size: 360,
        filterVariant: "date-range",
        Cell: ({ cell }: { cell: MRT_Cell<Attempt> }) => cell.getValue<Date>().toLocaleString(),
      },
      {
        accessorKey: "qid",
        header: "Id",
        muiFilterTextFieldProps: { placeholder: "Id" },
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 250,
        muiFilterTextFieldProps: { placeholder: "Title" },
      },
    ],
    [],
  );

  const {
    data: fetchedHistory = [],
    isError: isLoadingHistoryError,
    isFetching: isFetchingHistory,
    isLoading: isLoadingHistory,
  } = useGetHistory();

  function useGetHistory() {
    return useQuery<Attempt[]>({
      queryKey: ["history"],
      queryFn: async () => {
        const qMap = new Map();
        const questions = (await axios.get(`http://localhost:${process.env.REACT_APP_QUESTION_SVC_PORT}/api/question/`)).data;
        questions.forEach((item: Question) => qMap.set(item.qid, item.title));

        const history = (await axios.get(`http://localhost:${process.env.REACT_APP_HISTORY_SVC_PORT}/api/history/${user.id}`)).data;
        history.forEach((item: Attempt) => {
          item.timestamp = new Date(item.timestamp);
          item.title = qMap.get(item.qid);
        })
        return history;
      },
      refetchOnWindowFocus: false,
    });
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedHistory,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    mrtTheme: (theme: Theme) => ({
      baseBackgroundColor: theme.palette.grey[900],
    }),
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    state: {
      isLoading: isLoadingHistory,
      showAlertBanner: isLoadingHistoryError,
      showProgressBars: isFetchingHistory,
    },
    muiToolbarAlertBannerProps: isLoadingHistoryError
      ? { color: "error", children: "Error loading data" }
      : undefined,
  });

  return <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={createTheme({
      palette: {
        mode: "dark",
      }
    })}>
      <MaterialReactTable table={ table }/>
    </ThemeProvider>
  </LocalizationProvider>;
}

export default function HistoryPage() {
  return <MainLayout>
    <Box sx={{ margin: "50px" }}>
      <HistoryTable />
    </Box>
  </MainLayout>;
};
