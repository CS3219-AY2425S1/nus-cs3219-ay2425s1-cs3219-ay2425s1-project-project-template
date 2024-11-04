"use client";

import React, { useCallback } from "react";
import { Key as ReactKey } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";

import NavLink from "@/components/navLink";
import CategoryTags from "@/components/questions/CategoryTags";
import DifficultyTags from "@/components/questions/DifficultyTags";
import { History } from "@/types/history";

interface HistoryTableProps {
  username: string;
  sessions: History[];
  totalPages: number;
  totalSessions: number;
  pageNumber: number;
  handlePageOnClick: (page: number) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({
  username,
  sessions,
  totalPages,
  totalSessions,
  pageNumber,
  handlePageOnClick,
}) => {
  const columns = [
    { name: "No.", uid: "index" },
    { name: "Question", uid: "question" },
    { name: "Category", uid: "category" },
    { name: "Difficulty", uid: "complexity" },
    { name: "Language", uid: "language" },
    { name: "Partner", uid: "partner" },
  ];

  sessions = sessions.map((history, idx) => ({
    ...history,
    index: idx + 1,
  }));

  const renderCell = useCallback((session: History, columnKey: ReactKey) => {
    const question = session.question;

    switch (columnKey) {
      case "index": {
        return (
          <NavLink
            hover={true}
            href={`/history/session-details?id=${session.room_id}&index=${session.index}`}
          >
            {session.index}
          </NavLink>
        );
      }
      case "question": {
        const titleString = question?.title || "N/A";
        return <h2 className="capitalize">{titleString}</h2>;
      }
      case "category": {
        const categories = question?.category || [];
        return (
          <CategoryTags
            categories={categories}
            questionId={question?.questionId || ""}
          />
        );
      }
      case "complexity": {
        return <DifficultyTags difficulty={question?.complexity || "N/A"} />;
      }
      case "language": {
        return <h2>{session.language || "N/A"}</h2>;
      }
      case "partner": {
        return <h2>{session.userTwo || "N/A"}</h2>;
      }
      default: {
        return <h2>N/A</h2>;
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-10/12">
      <div className="flex w-full justify-between">
        <h2>History List</h2>
      </div>
      <div className="mt-5 h-52 w-full">
        <Table
          aria-label="History Table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                loop={true}
                page={pageNumber}
                total={totalPages}
                onChange={handlePageOnClick}
              />
            </div>
          }
          classNames={{
            table: "min-h-[600px]",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "action" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No sessions to display"} items={sessions}>
            {(item) => (
              <TableRow key={item.room_id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryTable;
