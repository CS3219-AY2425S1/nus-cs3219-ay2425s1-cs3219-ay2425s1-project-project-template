"use client"

import { socket } from "../../services/sessionSocketService";
import { useTheme } from "next-themes";
import { Card } from '@nextui-org/react';
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const UsersInRoom = () => {
  const { theme, resolvedTheme } = useTheme();
  const [users, setUsers] = useState<string[]>([]);
  const [isThemeReady, setIsThemeReady] = useState<boolean>(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

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

    return () => {
      (async () => {
        const resolvedSocket = await socket;
        resolvedSocket?.off("initialData");
        resolvedSocket?.off("userJoined");
        resolvedSocket?.off("userLeft");
      })();
    };
  }, []);

  const cardBgColor = users.length >= 2
    ? (theme === "dark" ? "bg-gradient-to-br from-[#2055A6] to-[#6F0AD4]" : "bg-gradient-to-br from-[#E0EEFA] to-[#C8BDE3]")
    : (theme === "dark" ? "bg-gray-700" : "bg-gray-200");

  if (!isThemeReady) {
    return null; // or a loading spinner, or any placeholder
  }

  return (
    <div className="flex justify-start items-center h-full w-full">
      <Card className={`inline-block p-1.5 ${cardBgColor} rounded-lg shadow-inner h-auto max-h-[150px]`}>
        <div className="flex flex-row items-center gap-2">
          <h3 className="text-lg font-bold mb-0.75">Users in Room:</h3>
          <div className="flex flex-wrap gap-1.5">
            {users.map((user, index) => (
              <Card key={index} className="p-1.5 bg-[#F9F9FC] dark:bg-blue-900 rounded-lg shadow min-h-[30px]">
                <ReactMarkdown components={{
                  p: ({ node, ...props }) => <p className="font-bold text-[#5633A9] dark:text-white text-sm" {...props} />
                }}>
                  {user}
                </ReactMarkdown>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}