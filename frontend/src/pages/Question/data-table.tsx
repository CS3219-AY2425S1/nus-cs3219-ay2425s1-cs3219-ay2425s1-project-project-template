import { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { type Question, fakeData, problemComplexity } from '../../makeData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Question>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'complexity',
        header: 'Complexity',
        editVariant: 'select',
        editSelectOptions: problemComplexity,
        muiEditTextFieldProps: {
            select: true,
        },
      },
      {
        accessorKey: 'categories',
        header: 'Categories',
        Cell: ({ cell }) => cell.getValue<string[]>().join(', '),
        muiEditTextFieldProps: {
            required: true,
          },
      },
    ],
    [],
  );

  //call CREATE hook
  const { mutateAsync: createQuestion, isPending: isCreatingQuestion } =
    useCreateQuestion();
  //call READ hook
  const {
    data: fetchedQuestions = [],
    isError: isLoadingQuestionsError,
    isFetching: isFetchingQuestions,
    isLoading: isLoadingQuestions,
  } = useGetQuestions();
  //call UPDATE hook
  const { mutateAsync: updateQuestion, isPending: isUpdatingQuestion } =
    useUpdateQuestion();
  //call DELETE hook
  const { mutateAsync: deleteQuestion, isPending: isDeletingQuestion } =
    useDeleteQuestion();

  //CREATE action
  const handleCreateQuestion: MRT_TableOptions<Question>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    await createQuestion(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveQuestion: MRT_TableOptions<Question>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    await updateQuestion(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Question>) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedQuestions,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingQuestionsError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateQuestion,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveQuestion,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Question</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents}
          <TextField
            label="Description"
            name="description"
            required
            multiline
            // onChange={(e) => {
            //   table.setCreatingRow({
            //     ...row.original,
            //     description: e.target.value,
            //   });
            // }}
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Question</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents}
          <TextField
            label="Description"
            name="description"
            required
            multiline
            // onChange={(e) => {
            //   table.setEditingRow({
            //     ...row.original,
            //     description: e.target.value,
            //   });
            // }}
            value={row.original.description}
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Question
      </Button>
    ),
    state: {
      isLoading: isLoadingQuestions,
      isSaving: isCreatingQuestion || isUpdatingQuestion || isDeletingQuestion,
      showAlertBanner: isLoadingQuestionsError,
      showProgressBars: isFetchingQuestions,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new question to api)
function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (question: Question) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newQuestionInfo: Question) => {
      queryClient.setQueryData(
        ['questions'],
        (prevQuestions: any) =>
          [
            ...prevQuestions,
            {
              ...newQuestionInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Question[],
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['questions'] }), //refetch questions after mutation, disabled for demo
  });
}

//READ hook (get questions from api)
function useGetQuestions() {
  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put question in api)
function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (question: Question) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newQuestionInfo: Question) => {
      queryClient.setQueryData(['questions'], (prevQuestions: any) =>
        prevQuestions?.map((prevQuestion: Question) =>
          prevQuestion.id === newQuestionInfo.id ? newQuestionInfo : prevQuestion,
        ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['questions'] }), //refetch questions after mutation, disabled for demo
  });
}

//DELETE hook (delete question in api)
function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (questionId: string) => {
      queryClient.setQueryData(['questions'], (prevQuestions: any) =>
        prevQuestions?.filter((question: Question) => question.id !== questionId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['questions'] }), //refetch questions after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithProviders;

