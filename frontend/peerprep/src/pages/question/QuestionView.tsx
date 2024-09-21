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
    Input,
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
            { header: "Complexity", accessorKey: "complexity" },
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
                <Button className="mr-4" onClick={onOpen}>
                    <Icon as={FiAlignJustify} />
                </Button>
                <img src={logo} alt="Peerprep Logo" className="w-10 h-10" />
                <span className="text-4xl text-white">PeerPrep</span>
            </Box>
            {/* Drawer for menu */}
            <MenuDrawer isOpen={isOpen} onClose={onClose}/>

            <Box className="justify-center items-center p-2">
                {/* Search Filter Input */}
                <Box className="flex item-center justify-between mb-1">
                    <Filters columnFilters={columnFilters} setColumnFilters={setColumnFilter} />
                    <h2 className="text-white text-3xl font-semibold mx-auto">Questions</h2>
                </Box>

                {/* Table Display */}
                <Box overflowX="auto">
                    <Table variant='striped' colorScheme='purple' bgColor={'white'}>
                        <Thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <Th key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody>
                            {table.getRowModel().rows.map(row => (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <Td key={cell.id}>
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
