"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock user data
const mockUsers = [
  {
    id: "iuwadiua",
    username: "user1",
    email: "user1@example.com",
    isAdmin: false,
    skillLevel: "Novice",
  },
  {
    id: "iawndaw",
    username: "user2",
    email: "user2@example.com",
    isAdmin: true,
    skillLevel: "Expert",
  },
  {
    id: "inawdiuwa",
    username: "user3",
    email: "user3@example.com",
    isAdmin: false,
    skillLevel: "Intermediate",
  },
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState<
    {
      id: string;
      username: string;
      email: string;
      isAdmin: boolean;
      skillLevel: string;
    }[]
  >([]);

  useEffect(() => {
    // Fetch users from the API but we use mock data here
    setUsers(mockUsers);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Skill Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
              <TableCell>{user.skillLevel}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => {}}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => {}}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
