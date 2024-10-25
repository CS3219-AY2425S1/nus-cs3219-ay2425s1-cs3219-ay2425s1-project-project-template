"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { UserProfile } from "@/types/User";
import { useYjsStore } from "@/lib/useYjsStore";

interface CollaborativeWhiteboardProps {
  sessionId: string;
  currentUser: UserProfile;
}

export default function CollaborativeWhiteboard({
  sessionId,
}: // currentUser,
CollaborativeWhiteboardProps) {
  const store = useYjsStore({
    roomId: sessionId,
    hostUrl: `ws://localhost:1234/yjs?sessionId=${sessionId}`,
  });

  // TODO: Implement user preferences
  return (
    <div className="w-full h-full">
      <Tldraw store={store} />
    </div>
  );
}
