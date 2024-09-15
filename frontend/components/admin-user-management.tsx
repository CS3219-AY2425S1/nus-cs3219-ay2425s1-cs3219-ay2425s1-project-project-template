"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fetcher = (url: string) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => {
    // TODO: Redirect to home page if user is not admin or error occurs
    if (res.status == 401) {
      throw new Error("You are not authorized to view this page.");
    }
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  });
};

export default function AdminUserManagement() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3001/users",
    fetcher
  );
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
    if (data) {
      setUsers(data.data);
    }
  }, [data]);

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
