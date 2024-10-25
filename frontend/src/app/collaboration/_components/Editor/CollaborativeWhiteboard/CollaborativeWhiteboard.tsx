"use client";

import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { UserProfile } from "@/types/User";

interface CollaborativeWhiteboardProps {
  sessionId: string;
  currentUser: UserProfile;
}

export default function CollaborativeWhiteboard({
  sessionId,
  currentUser,
}: CollaborativeWhiteboardProps) {
  const store = useSyncDemo({ roomId: sessionId });

  // TODO: Implement user preferences
  return (
    <div className="w-full h-full">
      <Tldraw store={store} />
    </div>
  );
}
