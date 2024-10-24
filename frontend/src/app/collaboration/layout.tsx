import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  // TODO:

  // When user is redirected to /collab/session-id
  // /collab/session-id -> Retrieve payload, getSessionInfo, authenticated, then ->
  // Initialize y-websocket connection using sessionId as roomId
  // Display relevant information to user (e.g. Questions, Chat, etc.)

  // Events/Listners:
  // User connected -> Wait for joinedRoom
  // User disconnected -> Nothing
  // User joinedRoom -> Return current list of users
  // User leftRoom -> Nothing
  // User addUserToRoom -> Someone joined the room
  // User removeUserFromRoom -> Someone left the room
  // User setLanguage -> Set language
  // User languageSet -> Update language

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-1 p-4">{children}</main>
    </div>
  );
}
