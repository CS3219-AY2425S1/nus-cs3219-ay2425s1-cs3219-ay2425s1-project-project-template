import {
  columns,
  Question,
  renderCell,
  complexityOptions,
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
  Spinner,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BoxIcon from "./boxicons";
import { SearchIcon } from "./icons";
import { DeleteConfirmationModal } from "./deleteconfirmationmodal";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

import useSWR from "swr";
import { capitalize } from "@/utils/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function QuestionsTable() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );

  const handleDelete = (question: Question) => {
    setQuestionToDelete(question);
    onOpen();
  };

  const deleteQuestion = async () => {
    if (questionToDelete) {
      try {
        await fetch(
          `http://localhost:8003/api/questions/${questionToDelete.question_id}`,
          {
            method: "DELETE",
          }
        );
        onOpenChange();
        location.reload();
      } catch (error) {
        console.error("Failed to delete the question", error);
      }
    }
  };

  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [complexityFilter, setComplexityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const { data: questionData, isLoading: questionLoading } = useSWR(
    `http://localhost:8003/api/questions?${hasSearchFilter ? `title=${filterValue}&` : ""}${complexityFilter !== null ? `complexity=${complexityFilter}&` : ""}${
      categoryFilter !== "all"
        ? Array.from(categoryFilter)
            .map((category) => `category=${encodeURIComponent(category)}`)
            .join("&") + "&"
        : ""
    }${`sort=${sortDescriptor.direction === "descending" ? "-" : ""}${sortDescriptor.column}&`}page=${page}`,
    fetcher
  );

  const { data: categoryData, isLoading: categoryLoading } = useSWR(
    `http://localhost:8003/api/questions/categories/unique`,
    fetcher
  );

  const uniqueCategories = React.useMemo(() => {
    return categoryData?.uniqueCategories;
  }, [categoryData?.uniqueCategories]);

  const pages = React.useMemo(() => {
    return questionData?.totalPages;
  }, [questionData?.totalPages]);

  const questionLoadingState = questionLoading ? "loading" : "idle";

  const items = React.useMemo(() => {
    return questionData?.totalQuestions;
  }, [questionData?.totalQuestions]);

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

  const handleSetComplexityFilter = useCallback((value: string | null) => {
    if (value) {
      setComplexityFilter(value);
      setPage(1);
    } else {
      setComplexityFilter(null);
    }
  }, []);

  const handleAddNew = () => {
    router.push("/questions-management/add");
  };

  const handleRowAction = (key) => {
    router.push(`/questions-management/edit/${key}`);
  };

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
            <Autocomplete
              placeholder="Select a complexity"
              className="w-[215px] "
              onSelectionChange={(key) =>
                handleSetComplexityFilter(key as string | null)
              }
            >
              {complexityOptions.map((complexity: string) => (
                <AutocompleteItem
                  key={complexity}
                  classNames={{
                    base: [
                      "rounded-md",
                      "text-default-500",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "data-[hover=true]:bg-default-100",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[selectable=true]:focus:bg-default-50",
                      "data-[pressed=true]:opacity-70",
                      "data-[focus-visible=true]:ring-default-500",
                    ],
                  }}
                >
                  {complexity}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<BoxIcon name="bx-chevron-down" />}
                  variant="flat"
                  className="text-zinc-500 dark:text-zinc-400 text-sm font-light bg-[#f3f4f5] dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-600"
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
                itemClasses={{
                  base: [
                    "rounded-md",
                    "text-default-500",
                    "transition-opacity",
                    "data-[hover=true]:text-foreground",
                    "data-[hover=true]:bg-default-100",
                    "dark:data-[hover=true]:bg-default-50",
                    "data-[selectable=true]:focus:bg-default-50",
                    "data-[pressed=true]:opacity-70",
                    "data-[focus-visible=true]:ring-default-500",
                  ],
                }}
              >
                {uniqueCategories && uniqueCategories.length > 0
                  ? uniqueCategories.map((category: string) => (
                      <DropdownItem key={category}>
                        {capitalize(category)}
                      </DropdownItem>
                    ))
                  : null}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              color="secondary"
              className="pr-5"
              startContent={<BoxIcon name="bx-plus" size="20px" />}
              onClick={handleAddNew}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {items} {items == 1 ? "question" : "questions"}
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    complexityFilter,
    categoryFilter,
    onSearchChange,
    onClear,
    hasSearchFilter,
    uniqueCategories,
    items,
  ]);

  return (
    <>
      <Table
        aria-label="Rows actions table example with dynamic content"
        removeWrapper
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={
          pages > 0 ? (
            <div className="py-2 px-2 flex justify-between items-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
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
          ) : null
        }
        bottomContentPlacement="outside"
        classNames={{
          th: [
            "bg-transparent",
            "text-default-500",
            "border-b",
            "border-divider",
          ],
        }}
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        sortDescritptor={setSortDescriptor}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => handleRowAction(key)}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className="text-base"
              {...(["title", "complexity"].includes(column.key)
                ? { allowsSorting: true }
                : {})}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={questionData?.questions ?? []}
          loadingContent={<Spinner />}
          loadingState={questionLoadingState}
          emptyContent={"No questions to display."}
        >
          {(question: Question) => (
            <TableRow key={question.question_id}>
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
        onConfirm={deleteQuestion}
      />
    </>
  );
}
