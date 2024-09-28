import React, { useState, useMemo } from "react";
import { Question } from "./questionService";
import logo from "/peerprep_logo.png";
import {
  useReactTable,
  ColumnFilter,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Badge,
  Box,
  Text,
  Button,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Filters from "../../components/Filter";
import { COMPLEXITIES, CATEGORIES } from "../../constants/data";
import DataTable from "../../components/DataTable";

type QuestionViewProps = {
  questions: Question[];
};

const QuestionView: React.FC<QuestionViewProps> = ({ questions }) => {
  const [columnFilters, setColumnFilter] = useState<ColumnFilter[]>([]);
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  ); // State for the selected question

  const getComplexityColor = (complexity: string) => {
    if (!complexity) return "white"; // Default color for undefined complexity
    const found = COMPLEXITIES.find(
      (c) => c.id.toLowerCase() === complexity.toLowerCase()
    );
    return found ? found.color : "white";
  };

  const getCategoryColor = (category: string) => {
    if (!category) return "white"; // Default color for undefined category
    const found = CATEGORIES.find(
      (c) => c.id.toLowerCase() === category.toLowerCase()
    );
    return found ? found.color : "white";
  };

  const columns: ColumnDef<Question>[] = useMemo(
    () => [
      { header: "ID", accessorKey: "ID" },
      { header: "Title", accessorKey: "Title" },
      {
        header: "Topic",
        accessorKey: "Categories",
        cell: ({ getValue }) => {
          const category = getValue<string>();
          const color = getCategoryColor(category);
          return (
            <Text color={color} fontWeight="bold" mb={1}>
              {category}
            </Text>
          );
        },
      },
      {
        header: "Complexity",
        accessorKey: "Complexity",
        cell: ({ getValue }) => {
          const complexity = getValue<string>();
          const color = getComplexityColor(complexity);
          return (
            <Badge borderRadius="lg" px="5" py="2" bg={color}>
              <Text color={"whitesmoke"}>{complexity}</Text>
            </Badge>
          );
        },
        enableSorting: true, // Enable sorting on this column
      },
      {
        header: "Question",
        accessorKey: "link",
        cell: ({ row }) => {
          return (
            <Button
              onClick={() => {
                setSelectedQuestion(row.original); // Set the selected question data
                onModalOpen(); // Open the modal
                onMenuClose(); // Close the menu if it is open
              }}
              colorScheme="blue"
              variant="link"
            >
              View
            </Button>
          );
        },
      },
    ],
    [onModalOpen, onMenuClose]
  );

  return (
    <Box
      className="flex flex-col min-h-screen bg-gradient-to-br from-[#1D004E] to-[#141A67]"
      p={4}
    >
      <Box className="flex-col justify-center items-center p-2">
        {/* Search Filter Input */}
        <h2 className="flex justify-center text-white text-3xl font-semibold">
          Questions
        </h2>
        <Filters
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilter}
        />
        {/* Table Display */}
        <DataTable
          columns={columns}
          data={questions}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilter}
        />

        {/* Modal for Question Details */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            onModalClose(); // Close modal
            onMenuClose(); // Ensure menu closes if modal closes
          }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent bg="#371F76">
            <ModalHeader color="white">{selectedQuestion?.Title}</ModalHeader>{" "}
            {/* Set text color to white */}
            <ModalCloseButton />
            <ModalBody>
              <Text color="white">{selectedQuestion?.Description}</Text>{" "}
              {/* Set text color to white */}
              <br /> {/* Add a line break for spacing */}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default QuestionView;
