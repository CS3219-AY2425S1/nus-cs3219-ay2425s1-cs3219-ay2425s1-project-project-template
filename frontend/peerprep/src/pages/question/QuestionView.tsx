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
<<<<<<< HEAD
  Badge,
  Box,
  Text,
  Button,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import MenuDrawer from "../../components/layout/MenuDrawer";
import { FiAlignJustify } from "react-icons/fi";
import Filters from "../../components/Filter";
import { CATEGORIES, COMPLEXITIES } from "../../constants/data";
import DataTable from "../../components/DataTable";
=======
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
} from '@chakra-ui/react';
import MenuDrawer from '../../components/MenuDrawer';
import { FiAlignJustify } from 'react-icons/fi';
import Filters from '../../components/Filter';
import { CATEGORIES, COMPLEXITIES } from '../../data';
import DataTable from '../../components/DataTable';
>>>>>>> 88b8ec8b205b1b491f09835f15006f0762d5dea3

type QuestionViewProps = {
  questions: Question[];
};

const QuestionView: React.FC<QuestionViewProps> = ({ questions }) => {
<<<<<<< HEAD
  const [columnFilters, setColumnFilter] = useState<ColumnFilter[]>([]);
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const getComplexityColor = (complexity: string) => {
    const found = COMPLEXITIES.find(
      (c) => c.id.toLowerCase() === complexity.toLowerCase()
=======
    const [columnFilters, setColumnFilter] = useState<ColumnFilter[]>([]);
    const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null); // State for the selected question

    const getComplexityColor = (complexity: string) => {
        if (!complexity) return 'white'; // Default color for undefined complexity
        const found = COMPLEXITIES.find(c => c.id.toLowerCase() === complexity.toLowerCase());
        return found ? found.color : 'white';
    };
    
    const getCategoryColor = (category: string) => {
        if (!category) return 'white'; // Default color for undefined category
        const found = CATEGORIES.find(c => c.id.toLowerCase() === category.toLowerCase());
        return found ? found.color : 'white';
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
                        <Text
                            color={color}
                            fontWeight='bold'
                            mb={1}
                        >
                            {category}
                        </Text>
                    );
                }
            },
            {
                header: "Complexity",
                accessorKey: "Complexity",
                cell: ({ getValue }) => {
                    const complexity = getValue<string>();
                    const color = getComplexityColor(complexity);
                    return (
                        <Badge borderRadius='lg' px='5' py='2' bg={color}>
                            <Text color={'whitesmoke'}>
                                {complexity}
                            </Text>
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
>>>>>>> 88b8ec8b205b1b491f09835f15006f0762d5dea3
    );
    return found ? found.color : "white";
  };

  const getCategoryColor = (category: string) => {
    const found = CATEGORIES.find(
      (c) => c.id.toLowerCase() === category.toLowerCase()
    );
    return found ? found.color : "white";
  };

  const columns: ColumnDef<Question>[] = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "Title", accessorKey: "title" },
      {
        header: "Topic",
        accessorKey: "categories",
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
        accessorKey: "complexity",
        cell: ({ getValue }) => {
          const complexity = getValue<string>();
          const color = getComplexityColor(complexity);
          return (
            <Badge borderRadius="lg" px="5" py="2" bg={color}>
              <Text color={"whitesmoke"}>{complexity}</Text>
            </Badge>
          );
        },
      },
      {
        header: "Question",
        accessorKey: "link",
        cell: ({ getValue }) => (
          <a
            href={getValue<string>()}
            className="text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        ),
      },
    ],
    []
  );

  return (
    <Box
      className="flex flex-col min-h-screen bg-gradient-to-br from-[#1D004E] to-[#141A67]"
      p={4}
    >
      {/* <Box className="flex justify-start items-center p-2 mb-5">
                <Button 
                    onClick={() => {
                        onMenuOpen(); // Open the menu
                        onModalClose(); // Close the modal if it is open
                    }} 
                    border="2px solid"
                    borderColor="white"
                    bg="transparent"
                    _hover={{ bg: 'purple' }}
                    className="mr-4"
                >
                    <Icon 
                        as={FiAlignJustify} 
                        color="white" 
                        className="bg-opacity-0" 
                    />
                </Button>
                <img src={logo} alt="Peerprep Logo" className="w-10 h-10" />
                <span className="text-4xl text-white">PeerPrep</span>
<<<<<<< HEAD
            </Box> */}

      {/* Drawer for menu */}
      {/* <MenuDrawer isOpen={isOpen} onClose={onClose}/> */}

      <Box className="flex-col justify-center items-center px-2">
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
      </Box>
    </Box>
  );
=======
            </Box>
            {/* Drawer for menu */}
            <MenuDrawer isOpen={isMenuOpen} onClose={() => {
                onMenuClose();
                onModalClose(); // Ensure modal closes if menu closes
            }}/>

            <Box className="flex-col justify-center items-center p-2">
                {/* Search Filter Input */}
                <h2 className="flex justify-center text-white text-3xl font-semibold">Questions</h2>
                <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilter} />
                {/* Table Display */}
                <DataTable columns={columns} data={questions} columnFilters={columnFilters} setColumnFilters={setColumnFilter}/>

                {/* Modal for Question Details */}
                <Modal isOpen={isModalOpen} onClose={() => {
                    onModalClose(); // Close modal
                    onMenuClose(); // Ensure menu closes if modal closes
                }} isCentered>
                    <ModalOverlay />
                    <ModalContent bg="#371F76"> 
                        <ModalHeader color="white">{selectedQuestion?.Title}</ModalHeader> {/* Set text color to white */}
                        <ModalCloseButton />
                        <ModalBody>
                            <Text color="white">{selectedQuestion?.Description}</Text> {/* Set text color to white */}
                            <br /> {/* Add a line break for spacing */}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </Box>
    );
>>>>>>> 88b8ec8b205b1b491f09835f15006f0762d5dea3
};

export default QuestionView;
