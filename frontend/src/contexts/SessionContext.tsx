"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { UserProfile } from "@/types/User";

interface SessionContextType {
  sessionId: string;
  userProfile: UserProfile | null;
  currentCode: string;
  setSessionId: (sessionId: string) => void;
  setCurrentCode: (code: string) => void;
  setUserProfile: (userProfile: UserProfile) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: React.ReactNode; initialUserProfile: UserProfile; initialSessionId: string }> = ({ children, initialUserProfile, initialSessionId }) => {
  const [currentCode, setCurrentCode] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);

  const contextValue = useMemo(() => ({
    currentCode,
    setCurrentCode,
    sessionId,
    setSessionId,
    userProfile,
    setUserProfile,
  }), [currentCode, sessionId, userProfile]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
};

