import React, { useState, useMemo } from 'react';
import { Question } from './questionService'; 
import logo from '/peerprep_logo.png';
import {
    useReactTable,
    ColumnFilter,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Button,
    Icon,
    useDisclosure,
} from '@chakra-ui/react';
import MenuDrawer from '../../components/MenuDrawer';
import { FiAlignJustify } from 'react-icons/fi';
import Filters from '../../components/Filter';

type QuestionViewProps = {
    questions: Question[];
};

const QuestionView: React.FC<QuestionViewProps> = ({ questions }) => {
    const [columnFilters, setColumnFilter] = useState<ColumnFilter[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI drawer hook

    const columns: ColumnDef<Question>[] = useMemo(
        () => [
            { header: "ID", accessorKey: "id" },
            { header: "Title", accessorKey: "title" },
            { header: "Topic", accessorKey: "categories" },
            {
                header: "Complexity",
                accessorKey: "complexity",
                cell: ({ getValue }) => {
                    const complexity = getValue<string>().toLowerCase();
                    let color = 'white'; // Default color
    
                    switch (complexity) {
                        case 'easy':
                            color = 'green.400';
                            break;
                        case 'med':
                            color = 'yellow.400';
                            break;
                        case 'hard':
                            color = 'red.400';
                            break;
                    }
    
                    return (
                        <Text color={color} fontWeight="bold" textTransform="capitalize">
                            {complexity}
                        </Text>
                    );
                }
            },
            {
                header: "Question",
                accessorKey: "link",
                cell: ({ getValue }) => (
                    <a href={getValue<string>()} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                        View
                    </a>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: questions,
        columns,
        state: {
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel : getFilteredRowModel(),
    });

    return (
        <Box className="flex flex-col min-h-screen bg-gradient-to-br from-[#1D004E] to-[#141A67]" p={4}>
            <Box className="flex justify-start items-center p-2 mb-5">
                <Button 
                    onClick={onOpen} 
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
            </Box>
            {/* Drawer for menu */}
            <MenuDrawer isOpen={isOpen} onClose={onClose}/>

            <Box className="flex-col justify-center items-center p-2">
                {/* Search Filter Input */}
                <h2 className="flex justify-center text-white text-3xl font-semibold">Questions</h2>
                <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilter} />
                {/* Table Display */}
                <Box className="bg-white justify-between bg-opacity-10 rounded-md border-radius-md p-4" overflowX="auto">
                    <Table variant='simple' colorScheme='#141A67'>
                        <Thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <Tr key={headerGroup.id} bgColor="purple.200" boxShadow="md">
                                    {headerGroup.headers.map(header => (
                                        <Th key={header.id} px={6} py={4} textAlign="center" textColor="black.300">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody>
                            {table.getRowModel().rows.map(row => (
                                <Tr 
                                    key={row.id} 
                                    color={'white'} 
                                    _hover={{ bgColor: 'purple' }}
                                    border="2px solid" 
                                    borderColor="gray.200"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <Td 
                                            key={cell.id} 
                                            px={6} 
                                            py={4} 
                                            textAlign="center" 
                                            borderRight="2px solid" 
                                            borderColor="gray.300"
                                            _last={{ borderRight: "none" }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </Box>
    );
};

export default QuestionView;
