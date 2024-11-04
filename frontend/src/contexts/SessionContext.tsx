"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  SessionUserProfiles,
  SessionUserProfilesSchema,
  UserProfile,
} from "@/types/User";
import { createCodeReview } from "@/services/collaborationService";
import { CodeReview } from "@/types/CodeReview";
import { io } from "socket.io-client";
import { SessionJoinRequest } from "@/types/SessionInfo";
import {
  ChatMessage,
  ChatMessages,
  ChatMessageSchema,
  ChatMessagesSchema,
  ChatMessageStatusEnum,
} from "@/types/ChatMessage";
import { v4 as uuidv4 } from "uuid";

interface SessionContextType {
  isConnected: boolean;
  sessionId: string;
  sessionUserProfiles: SessionUserProfiles;
  userProfile: UserProfile | null;
  getUserProfileDetailByUserId: (userId: string) => UserProfile | undefined; // all profiles in a session including currUser
  messages: ChatMessage[];
  handleSendMessage: (message: string) => void;
  setSessionId: (sessionId: string) => void;
  setUserProfile: (userProfile: UserProfile) => void;
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
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  socketUrl,
  initialUserProfile,
  initialSessionId,
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [sessionUserProfiles, setSessionUserProfiles] =
    useState<SessionUserProfiles>([]);
  const [userProfile, setUserProfile] =
    useState<UserProfile>(initialUserProfile);
  const [messages, setMessages] = useState<ChatMessages>([]);

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

  const getUserProfileDetailByUserId = useCallback(
    (userId: string) => {
      return sessionUserProfiles.find((profile) => profile.id === userId);
    },
    [sessionUserProfiles]
  );

  const socket = useMemo(() => {
    return io(socketUrl, {
      autoConnect: false,
      reconnection: false,
    });
  }, [socketUrl]);

  const handleSendMessage = useCallback(
    (message: string) => {
      if (!socket.connected) return;

      const newMessage: ChatMessage = {
        id: uuidv4(),
        userId: userProfile.id,
        sessionId,
        message,
        status: ChatMessageStatusEnum.enum.sending,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      socket.emit(
        "chatSendMessage",
        newMessage,
        (ack: {
          success: boolean;
          data: { id: string; timestamp: string };
          error: string | undefined;
        }) => {
          setMessages((prev) =>
            prev.map((message) => {
              if (message.id !== ack.data.id) return message;
              if (ack.success) {
                return {
                  ...message,
                  status: ChatMessageStatusEnum.enum.sent,
                };
              } else {
                return {
                  ...message,
                  status: ChatMessageStatusEnum.enum.failed,
                };
              }
            })
          );

          if (ack.success) {
            newMessage.status = ChatMessageStatusEnum.enum.sent;
            newMessage.timestamp = ack.data.timestamp;
          } else {
            newMessage.status = ChatMessageStatusEnum.enum.failed;
          }
        }
      );
    },
    [socket]
  );

  const sessionJoinRequest: SessionJoinRequest = {
    userId: userProfile.id,
    sessionId,
  };

  // connect to the session socket on mount
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("sessionJoin", sessionJoinRequest);
    });

    socket.on("sessionJoined", ({ userId, messages, sessionUserProfiles }) => {
      console.log("sessionJoined occured");
      try {
        if (userId === userProfile.id) {
          setIsConnected(true);
          const currentMessages = ChatMessagesSchema.parse(
            messages.map((message: ChatMessage) => ({
              ...message,
              status: ChatMessageStatusEnum.enum.sent,
            }))
          );
          setMessages([...currentMessages]);
        }

        const currentSessionUserProfiles =
          SessionUserProfilesSchema.parse(sessionUserProfiles);
        setSessionUserProfiles([...currentSessionUserProfiles]);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("sessionLeft", ({ userId, sessionUserProfiles }) => {
      try {
        console.log("sessionLeft occured");

        const currentSessionUserProfiles =
          SessionUserProfilesSchema.parse(sessionUserProfiles);
        setSessionUserProfiles([...currentSessionUserProfiles]);

        console.log(userProfile);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("chatReceiveMessage", (data) => {
      try {
        data["status"] = ChatMessageStatusEnum.enum.sent;
        const messageParsed = ChatMessageSchema.parse(data);

        if (messageParsed.userId === userProfile.id) return;

        setMessages((prev) => [...prev, messageParsed]);
      } catch (e) {
        console.log(e);
      }
    });

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
      sessionUserProfiles,
      getUserProfileDetailByUserId,
      userProfile,
      setUserProfile,
      messages,
      setMessages,
      handleSendMessage,
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
      sessionUserProfiles,
      getUserProfileDetailByUserId,
      userProfile,
      messages,
      handleSendMessage,
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
