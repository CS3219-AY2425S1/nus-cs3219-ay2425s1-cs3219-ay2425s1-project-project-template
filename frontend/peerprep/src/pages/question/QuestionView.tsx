import React, { useState, useMemo } from "react";
import { Question } from "./questionService";
import {
  ColumnFilter,
  ColumnDef
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
    ButtonGroup, 
    IconButton,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import MenuDrawer from "../../components/layout/MenuDrawer";
import { FiAlignJustify } from 'react-icons/fi';
import Filters from '../../components/Filter';
import { COMPLEXITIES, CATEGORIES } from "../../constants/data";
import DataTable from '../../components/DataTable';
import QuestionModal from '../../components/QuestionModel';

type QuestionViewProps = {
  questions: Question[];
  onDeleteQuestion: (title: string) => void;
};

const QuestionView: React.FC<QuestionViewProps> = ({ questions, onDeleteQuestion }) => {
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
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const { 
    isOpen: isQuestionModalOpen, 
    onOpen : onQuestionModalOpen, 
    onClose : onQuestionModalClose 
  } = useDisclosure();

  const handleAdd = (newQuestion: { title: string; description: string; categories: string; complexity: string; link: string }) => {
    const lastQuestionId = questions.length > 0 ? Math.max(...questions.map(q => q.ID)) : 0;
    const newQuestionWithId: Question = {
      ID: lastQuestionId + 1,
      Title: newQuestion.title,
      Description: newQuestion.description,
      Categories: newQuestion.categories,
      Complexity: newQuestion.complexity,
      link: newQuestion.link,
    };
    console.log('Added Question:', newQuestionWithId);
    onQuestionModalClose();
  };

  const handleEdit = (updatedQuestion: { title: string; description: string; categories: string; complexity: string; link: string }) => {
    if (selectedQuestion) {
      const newQuestionWithId: Question = {
        ID: selectedQuestion.ID,
        Title: updatedQuestion.title,
        Description: updatedQuestion.description,
        Categories: updatedQuestion.categories,
        Complexity: updatedQuestion.complexity,
        link: updatedQuestion.link,
      };
      console.log('Editing Question:', newQuestionWithId);
      setSelectedQuestion(newQuestionWithId);
      onQuestionModalClose();
    }
  };

  const getComplexityColor = (complexity: string) => {
    const found = COMPLEXITIES.find(
      (c) => c.id.toLowerCase() === complexity.toLowerCase()
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
        enableSorting: true,
      },
      {
        header: "Question",
        accessorKey: "link",
        cell: ({ row }) => {
          return (
            <Button
              onClick={() => {
                setSelectedQuestion(row.original);
                onModalOpen();
                onMenuClose();
              }}
              colorScheme="blue"
              variant="link"
            >
              View
            </Button>
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <ButtonGroup size="sm" isAttached>
            <IconButton
              icon={<Icon as={FaEdit} />}
              aria-label="Edit"
              colorScheme="purple"
              onClick={() => {
                setSelectedQuestion(row.original);
                onQuestionModalOpen();
                onMenuClose();
              }}
            />
            {/* Delete Button */}
            <IconButton
              icon={<Icon as={FaTrash} />}
              aria-label="Delete"
              colorScheme="red"
              onClick={() => {
                onDeleteQuestion(row.original.Title); // Call the delete handler
              }}
            />
          </ButtonGroup>
        ),
      },
    ],
    [onModalOpen, onMenuClose, onDeleteQuestion]
  );

  return (
    <Box className="flex flex-col min-h-screen bg-gradient-to-br from-[#1D004E] to-[#141A67]" p={4}>
      <MenuDrawer isOpen={isMenuOpen} onClose={onMenuClose} />

      <Box className="flex-col justify-center items-center p-2">
        <h2 className="flex justify-center text-white text-3xl font-semibold">Questions</h2>
        <Box className='flex justify-between'>
          <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilter} />
          <Button colorScheme='purple' onClick={() => { setSelectedQuestion(null); onQuestionModalOpen(); }}>Add Question</Button>
        </Box>

        <DataTable columns={columns} data={questions} columnFilters={columnFilters} setColumnFilters={setColumnFilter} />

        <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
          <ModalOverlay />
          <ModalContent bg="#371F76">
            <ModalHeader color="white">{selectedQuestion?.Title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text color="white">{selectedQuestion?.Description}</Text>
              <br />
            </ModalBody>
          </ModalContent>
        </Modal>

        <QuestionModal
          isOpen={isQuestionModalOpen}
          onClose={onQuestionModalClose}
          onSave={selectedQuestion ? handleEdit : handleAdd}
          initialQuestion={selectedQuestion}
        />
      </Box>
    </Box>
  );
};

export default QuestionView;
