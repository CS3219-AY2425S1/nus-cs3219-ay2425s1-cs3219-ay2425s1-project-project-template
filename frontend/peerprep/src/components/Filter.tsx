import React from "react";
import {
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { ColumnFilter } from '@tanstack/react-table';
import { FaSearch } from "react-icons/fa";


// Define the type for the props
interface FiltersProps {
  columnFilters: ColumnFilter[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
}

const Filters: React.FC<FiltersProps> = ({ columnFilters, setColumnFilters }) => {
  const questions = columnFilters.find((f) => f.id === "title")?.value || "";

  const onFilterChange = (id: string, value: string) =>
    setColumnFilters((prev) =>
      prev
        .filter((f) => f.id !== id)
        .concat({
          id,
          value,
        })
    );

  return (
    <HStack mb={6} spacing={3}>
      <InputGroup size="sm" maxW="12rem">
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color={"grey"} />
        </InputLeftElement>
        <Input
          type="text"
          variant="filled"
          placeholder="Title"
          textColor={"grey"}
          borderRadius={5}
          value={questions}
          onChange={(e) => onFilterChange("title", e.target.value)}
        />
      </InputGroup>
    </HStack>
  );
};

export default Filters;
