"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { UserProfile } from "@/types/User";
import { createCodeReview } from "@/services/collaborationService";
import { CodeReview } from "@/types/CodeReview";
import { io } from "socket.io-client";
import { SessionJoinRequest } from "@/types/SessionInfo";
import { ChatMessage } from "@/types/ChatMessage";
import { Question } from "@/types/Question";
import { SubmissionResult } from "@/types/TestResult";

interface SessionContextType {
  isConnected: boolean;
  sessionId: string;
  userProfile: UserProfile | null;
  messages: ChatMessage[];
  setSessionId: (sessionId: string) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  submitCode: () => void;
  submitting: boolean;
  submissionResult?: SubmissionResult;
  testResultPanel: string;
  setSubmissionResult: (result: SubmissionResult) => void;
  setTestResultPanel: (panel: string) => void;
  codeReview: {
    isGeneratingCodeReview: boolean;
    currentClientCode: string;
    hasCodeReviewResults: boolean;
    setCurrentClientCode: (code: string) => void;
    codeReviewResult: CodeReview;
    generateCodeReview: () => void;
  };
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  socketUrl: string;
  initialUserProfile: UserProfile;
  initialSessionId: string;
  question: Question;
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  socketUrl,
  initialUserProfile,
  initialSessionId,
  question,
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [userProfile, setUserProfile] =
    useState<UserProfile>(initialUserProfile);
  const [messages, setMessages] = useState([]);
  const [codeReview, setCodeReview] = useState({
    isGeneratingCodeReview: false,
    currentClientCode: "",
    hasCodeReviewResults: false,
    codeReviewResult: {
      body: "",
      codeSuggestion: "",
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
      const response = await createCodeReview(
        sessionId,
        codeReview.currentClientCode
      );
      if (response.statusCode !== 200) {
        throw new Error(response.message);
      }
      console.log(response.data);
      setCodeReview((prev) => ({
        ...prev,
        codeReviewResult: response.data,
        hasCodeReviewResults: true,
      }));
    } catch (error) {
      console.error("Code review generation failed:", error);
    } finally {
      setCodeReview((prev) => ({ ...prev, isGeneratingCodeReview: false }));
    }
  }, [codeReview.currentClientCode, sessionId]);

  const socket = useMemo(() => {
    return io(socketUrl, {
      autoConnect: false,
      reconnection: false,
    });
  }, [socketUrl]);

  const handleSendMessage = useCallback(() => {}, []);

  const sessionJoinRequest: SessionJoinRequest = {
    userId: userProfile.id,
    sessionId: sessionId,
  };

  const [submitting, setSubmitting] = useState(false);

  const [submissionResult, setSubmissionResult] = useState<SubmissionResult>();

  const [testResultPanel, setTestResultPanel] = useState("test-cases");

  const submitCode = useCallback(() => {
    if (submitting) {
      return;
    }

    if (!socket.connected) {
      return;
    }

    socket.emit("submit", {
      userId: userProfile.id,
      sessionId: sessionId,
      questionId: question._id,
      code: codeReview.currentClientCode,
    });
  }, [socket, userProfile, sessionId, codeReview.currentClientCode]);

  const onSubmitting = useCallback(({}: { message: string }) => {
    setSubmitting(true);
  }, []);

  const onSubmitted = useCallback(
    async ({
      submissionResult,
    }: {
      message: string;
      submissionResult: SubmissionResult;
    }) => {
      setSubmissionResult(submissionResult);

      console.log(submissionResult);

      setSubmitting(false);

      setTestResultPanel("test-result");
    },
    []
  );

  // connect to the session socket on mount
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("sessionJoin", sessionJoinRequest);
    });

    socket.on("sessionJoined", ({ userId }) => {
      if (userId === userProfile.id) {
        setIsConnected(true);
        // do fetching of chats here
        return;
      }
    });

    socket.on("sessionLeft", ({ userId }) => {
      console.log(`${userId} left`);
    });

    socket.on("submitting", onSubmitting);
    socket.on("submitted", onSubmitted);

    return () => {
      socket.emit("sessionLeave", sessionJoinRequest);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket]);

  const contextValue: SessionContextType = useMemo(
    () => ({
      isConnected,
      sessionId,
      setSessionId,
      userProfile,
      setUserProfile,
      messages,
      setMessages,
      submitCode,
      submitting,
      submissionResult,
      testResultPanel,
      setTestResultPanel,
      setSubmissionResult,
      codeReview: {
        ...codeReview,
        setCurrentClientCode,
        generateCodeReview,
      },
    }),
    [
      isConnected,
      codeReview,
      sessionId,
      userProfile,
      messages,
      submitCode,
      submitting,
      submissionResult,
      testResultPanel,
      setTestResultPanel,
      setCurrentClientCode,
      generateCodeReview,
    ]
  );

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
