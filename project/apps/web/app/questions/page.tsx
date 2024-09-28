"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Popularity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Sample Question</TableCell>
            <TableCell>Easy</TableCell>
            <TableCell>Strings, Algorithms</TableCell>
            <TableCell>5/5</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
