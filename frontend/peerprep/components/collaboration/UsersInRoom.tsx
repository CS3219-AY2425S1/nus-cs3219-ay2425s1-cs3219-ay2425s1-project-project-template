"use client"

import { socket } from "../../services/sessionSocketService";
import { useTheme } from "next-themes";
import { Card } from '@nextui-org/react';
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const UsersInRoom = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const resolvedSocket = await socket;

      resolvedSocket?.on("initialData", (data: any) => {
        const { sessionData } = data;
        setUsers(sessionData.usersInRoom || []);
      });

      resolvedSocket?.on("userJoined", (data: any) => {
        const { usersInRoom } = data;
        setUsers(usersInRoom || []);
        console.log("user joined", users);
      });

      resolvedSocket?.on("userLeft", (data: any) => {
        const { usersInRoom } = data;
        setUsers(usersInRoom || []);
      });
    })();
  }, []);

  const cardBgColor = users.length >= 2 
    ? (theme === "dark" ? "bg-gradient-to-br from-[#2055A6] to-[#6F0AD4]" : "bg-gradient-to-br from-[#A6C8FF] to-[#D4A6FF]")
    : (theme === "dark" ? "bg-gray-700" : "bg-gray-200");

  return (
    <div className="flex justify-center items-center h-full w-full">
      <Card className={`inline-block p-2 ${cardBgColor} rounded-lg shadow-inner h-auto max-h-[150px]`}>
        <div className="flex flex-row items-center gap-2">
          <h3 className="text-xl font-bold mb-1">Users in Room:</h3>
          <div className="flex flex-wrap gap-2">
            {users.map((user, index) => (
              <Card key={index} className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shadow min-h-[30px]">
                <ReactMarkdown>{user}</ReactMarkdown>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}