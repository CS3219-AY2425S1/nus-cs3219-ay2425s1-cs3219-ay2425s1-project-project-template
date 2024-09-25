"use client";

import {
  columns,
  Question,
  renderCell,
  complexityOptions,
  categoryOptions,
} from "@/app/questions-management/list/columns";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Button,
  Pagination,
  SortDescriptor,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useCallback, useMemo, useState } from "react";
import BoxIcon from "./boxicons";
import { SearchIcon } from "./icons";
import { DeleteConfirmationModal } from "./deleteconfirmationmodal";

export default function QuestionsTable({
  questions,
}: {
  questions: Question[];
}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    onOpen();
  };
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );

  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [complexityFilter, setComplexityFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const filteredItems = React.useMemo(() => {
    let filteredQuestions = [...questions];

    if (hasSearchFilter) {
      filteredQuestions = filteredQuestions.filter((user) =>
        user.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      complexityFilter !== "all" &&
      Array.from(complexityFilter).length !== complexityFilter.length
    ) {
      filteredQuestions = filteredQuestions.filter((question) =>
        Array.from(complexityFilter).includes(question.complexity)
      );
    }
    if (
      categoryFilter !== "all" &&
      Array.from(categoryFilter).length !== categoryFilter.length
    ) {
      filteredQuestions = filteredQuestions.filter((question) =>
        Array.from(categoryFilter).some((filterCategory) =>
          question.category.includes(filterCategory)
        )
      );
    }

    return filteredQuestions;
  }, [questions, filterValue, complexityFilter, categoryFilter]);

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Question, b: Question) => {
      const first = a[sortDescriptor.column as keyof Question] as string;
      const second = b[sortDescriptor.column as keyof Question] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-row gap-4">
            <Input
              isClearable
              className="min-w-fit sm:max-w-[30%]"
              placeholder="Search by question title..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<BoxIcon name="bx-chevron-down" />}
                  variant="flat"
                  className="text-gray-600 dark:text-gray-200"
                >
                  Complexity
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={complexityFilter}
                selectionMode="multiple"
                onSelectionChange={setComplexityFilter}
              >
                {complexityOptions.map((complexity) => (
                  <DropdownItem key={complexity}>{complexity}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<BoxIcon name="bx-chevron-down" />}
                  variant="flat"
                  className="text-gray-600 dark:text-gray-200"
                >
                  Category
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={categoryFilter}
                selectionMode="multiple"
                onSelectionChange={setCategoryFilter}
              >
                {categoryOptions.map((category) => (
                  <DropdownItem key={category}>{category}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              color="danger"
              variant="light"
              className="pr-5"
              startContent={<BoxIcon name="bx-trash" size="20px" />}
            >
              Delete
            </Button>
            <Button
              color="secondary"
              className="pr-5"
              startContent={<BoxIcon name="bx-plus" size="20px" />}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length}{" "}
            {filteredItems.length == 1 ? "question" : "questions"}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    complexityFilter,
    categoryFilter,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400 text-left">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="md"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="md"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Rows actions table example with dynamic content"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        selectionBehavior="toggle"
        onSelectionChange={setSelectedKeys}
        sortDescritptor={setSortDescriptor}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => alert(`Opening item ${key}...`)}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className="text-base"
              {...(["title", "complexity", "category"].includes(column.key)
                ? { allowsSorting: true }
                : {})}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={sortedItems}
          emptyContent={"No questions to display."}
        >
          {(question) => (
            <TableRow key={question._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(question, columnKey, handleDelete)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        questionToDelete={questionToDelete}
      />
    </>
  );
}
