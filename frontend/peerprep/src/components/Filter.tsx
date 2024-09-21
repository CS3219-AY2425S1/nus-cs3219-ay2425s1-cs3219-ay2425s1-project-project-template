import React from "react";
import {
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { ColumnFilter } from "@tanstack/react-table";
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
    <HStack mb={6} spacing={4} align="center">
      <InputGroup size="sm" maxW="16rem" boxShadow="sm">
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color={"white"} boxSize={4} />
        </InputLeftElement>
        <Input
          type="text"
          variant="filled"
          placeholder="Search by Title"
          textColor={"white"}
          bg={"rgba(255, 255, 255, 0.1)"}
          _hover={{
            bg: "rgba(255, 255, 255, 0.2)",
            boxShadow: "white", 
          }}
          _focus={{
            bg: "purple",
            textColor: "black",
            borderColor: "white",
            boxShadow: "white",
          }}
          _placeholder={{ color: "white" }}
          borderRadius={8}
          value={questions}
          onChange={(e) => onFilterChange("title", e.target.value)}
        />
      </InputGroup>
    </HStack>
  );
};

export default Filters;
