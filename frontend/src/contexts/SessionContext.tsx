"use client";

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { UserProfile } from "@/types/User";
import { createCodeReview } from "@/services/collaborationService";

interface SessionContextType {
  sessionId: string;
  userProfile: UserProfile | null;
  setSessionId: (sessionId: string) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  codeReview: {
    isGeneratingCodeReview: boolean;
    currentClientCode: string;
    setCurrentClientCode: (code: string) => void;
    codeReviewResult: {
      header: string;
      body: string;
    };
    generateCodeReview: () => void;
  };
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: React.ReactNode; initialUserProfile: UserProfile; initialSessionId: string }> = ({ children, initialUserProfile, initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);
  const [codeReview, setCodeReview] = useState({
    isGeneratingCodeReview: false,
    currentClientCode: "",
    codeReviewResult: {
      header: "No code review available",
      body: "",
    },
  });

  const setCurrentClientCode = useCallback((code: string) => {
    setCodeReview((prev) => ({ ...prev, currentClientCode: code }));
  }, []);

  // TODO: Format code for input to code review
  // const formatCode = useCallback(() => {}, []);

  const generateCodeReview = useCallback(async () => {
    setCodeReview((prev) => ({ ...prev, isGeneratingCodeReview: true }));
    try {
      const response = await createCodeReview(sessionId, codeReview.currentClientCode);
      if (response.statusCode !== 200) {
        throw new Error(response.message);
      }
      setCodeReview((prev) => ({ ...prev, codeReviewResult: response.data }));
    } catch (error) {
      console.error("Code review generation failed:", error);
      setCodeReview((prev) => ({
        ...prev,
        codeReviewResult: {
          header: "Code review generation failed",
          body: "",
        },
      }));
    } finally {
      setCodeReview((prev) => ({ ...prev, isGeneratingCodeReview: false}));
    }
  }, [codeReview.currentClientCode, sessionId]);

  const contextValue: SessionContextType = useMemo(
    () => ({
      sessionId,
      setSessionId,
      userProfile,
      setUserProfile,
      codeReview: {
        ...codeReview,
        setCurrentClientCode,
        generateCodeReview,
      },
    }),
    [codeReview, sessionId, userProfile, setCurrentClientCode, generateCodeReview]
  );

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
};
