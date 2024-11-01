import { FC, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import PeopleIcon from "@mui/icons-material/People";
import CodeEditor from "../../components/Collaboration/codeEditor";
import CallIcon from '@mui/icons-material/Call';
import { Question } from "../Question/question";
import LeaveRoomModal from "./leaveRoomModal";
import QuestionSelectModal from "./questionSelectModal";
import ChatCard from "./chatCard";
import { Socket, io } from "socket.io-client";
import { AuthContext } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { blue, lightBlue, lightGreen } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";
import CallNotification from "../../components/Communication/callNotification";
import VideoCall from "../../components/Communication/videoCall";

type Caller = {
  username: string,
  avatar: string
}

export type CallNotificationState = {
  caller: Caller,
  isOpen: boolean
}

const CollaborationPage: FC = () => {
  const navigate = useNavigate();
  const { collabSocket, commSocket, setCollabSocket, setCommSocket } = useSocket();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  // const { roomId = "", userId = "", question = null } = location.state || {};
  const { roomId } = useParams();
  const {
    userId =  user.id,
    userName = user.username,
    question = {
      title: "Placeholder Question Title",
      description: "This is a placeholder description for testing.",
      complexity: "Medium",
    },
  } = location.state || {};
  const [isLeaveRoomModalOpen, setIsLeaveRoomModalOpen] =
    useState<boolean>(false);
  const [isChangeQuestionModalOpen, setIsChangeQuestionModalOpen] =
    useState(false);
  const [isAwaitingCallResponse, setIsAwaitingCallResponse] = useState(false);
  const [notification, setNotifcation] = useState<CallNotificationState>({
    caller: {
      username: "",
      avatar: ""
    },
    isOpen: false
  })


  const handleOpenLeaveRoomModal = () => {
    setIsLeaveRoomModalOpen(true);
  };

  const handleCloseLeaveRoomModal = () => {
    setIsLeaveRoomModalOpen(false);
  };

  const handleLeaveRoom = () => {
    onLeaveRoom();
  };
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    question
  );
  const onLeaveRoom = () => {
    navigate("/");
    collabSocket?.emit("leave-room", roomId);
    collabSocket?.disconnect();
    commSocket?.disconnect();
  };
  const handleQuestionChangeClick = () => setIsChangeQuestionModalOpen(true);
  const handleChangeQuestionModalClose = () =>
    setIsChangeQuestionModalOpen(false);
  const handleQuestionSelect = (question: Question) => {
    collabSocket?.emit("question-change", roomId, question);
    setSelectedQuestion(question);
    setIsChangeQuestionModalOpen(false); // Close the modal after selection
  };
  const handleCallButtonClick = () => {
    commSocket!.emit("initiate-call", roomId, {username: user.username, avatar: user.avatar});
    setIsAwaitingCallResponse(true);
    
  }
  const handleCallResponse = (isAnswer: boolean) => {
    setNotifcation(oldNotification => ({...oldNotification, isOpen: false}));
    commSocket?.emit("call-response", isAnswer, roomId);
  }


  useEffect(() => {

    // collabSocket = io(`http://localhost:${process.env.REACT_APP_COLLAB_SVC_PORT}`, {
    //   auth: {
    //     userId: user.id,
    //     username: user.username
    //   },
    //   transports: ["websocket"]
    // });
    // commSocket = io(`http://localhost:${process.env.REACT_APP_COMM_SVC_PORT}`, {
    //   auth: {
    //     userId: user.id,
    //     username: user.username
    //   },
    //   transports: ["websocket"]
    // });
    setCollabSocket(io(`http://localhost:${process.env.REACT_APP_COLLAB_SVC_PORT}`, {
      auth: {
        userId: user.id,
        username: user.username
      },
      transports: ["websocket"],
    }));
    setCommSocket(io(`http://localhost:${process.env.REACT_APP_COMM_SVC_PORT}`, {
      auth: {
        userId: user.id,
        username: user.username
      },
      transports: ["websocket"],
    }));

    // if (!collabSocket) {
    //   navigate("/");
    //   return;
    // }
    // if (!commSocket) {
    //   navigate("/");
    //   return;
    // }
    
    // if (!collabSocket.connected) {
    //   collabSocket.connect();
    // }

    // if (!commSocket.connected) {
    //   commSocket.connect();
    // }


  
    }, [])
  
    useEffect(() => {
      if (!collabSocket) {
        return;
      }
      if (!commSocket) {
        return;
      }
      collabSocket.on("connect", () => {
        collabSocket?.emit("join-room", roomId);
      });
  
      commSocket.on("connect", () => {
        commSocket?.emit("join-room", roomId);
      });
  
      collabSocket.on("connect_error", (err: Error) => {
        console.log(`Error: ${err.message}`);
        navigate("/");
      });
  
      commSocket.on("connect_error", (err: Error) => {
        console.log(`Error ${err.message}`);
        navigate("/");
      });
  
      collabSocket.on("user-left", (_user: string) => {
        collabSocket?.disconnect();
        commSocket?.disconnect();
        navigate("/");
      });
  
      collabSocket.on("sync-question", (question: Question) => {
        setSelectedQuestion(question);
      });
      
      commSocket.on("incoming-call", (caller : Caller) => {
        setNotifcation({
          caller: caller,
          isOpen: true
        });
      });
  
      commSocket.on("call-response", (isAnswer : boolean) => {
        setIsAwaitingCallResponse(false);
        
      });
    
      return () => {
        if (collabSocket && collabSocket!.connected) {
          collabSocket.removeAllListeners();
          collabSocket.disconnect();
        }  
        
        if (commSocket && commSocket.connected) {
              commSocket.removeAllListeners();
              commSocket.disconnect();
          }
      };
    }, [collabSocket, commSocket])

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      {/* <VideoCall/> */}
      <Box>
        <AppBar
          position="static"
          sx={{ width: "100vw", backgroundColor: "#262928" }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <img
                className="h-12 mr-6"
                alt="peerprep logo"
                src="/logo-with-text.svg"
              />
              {/* Flexible space to push buttons to the right */}
              <Box sx={{ flexGrow: 1 }} />
              <LoadingButton
                variant="contained"
                onClick={handleCallButtonClick}
                startIcon={<CallIcon/>}
                sx={{mx: 3,
                  ":disabled": {
                    backgroundColor: blue[900]
                  }
                }}
                className="px-4 py-2 rounded hover:bg-green-500 transition-colors"
                loading={isAwaitingCallResponse}>
                  Call Peer

              </LoadingButton>

              <Button
                variant="contained"
                onClick={handleQuestionChangeClick}
                startIcon={<PeopleIcon />}
                sx={{ mx: 3 }}
                className="px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Change Question
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenLeaveRoomModal}
                startIcon={<PeopleIcon />}
                sx={{ mx: 3 }}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Leave Room
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <LeaveRoomModal
        open={isLeaveRoomModalOpen}
        onClose={handleCloseLeaveRoomModal}
        onConfirm={handleLeaveRoom} // Confirm action
      />

      <QuestionSelectModal
        open={isChangeQuestionModalOpen}
        onClose={handleChangeQuestionModalClose}
        onQuestionSelect={handleQuestionSelect}
      />
      <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Left Panel - Question and Chat */}
        <div className="flex flex-col gap-4">
          {/* Question */}
          <Card className="border-gray-700 text-white flex flex-col h-full">
            <CardContent
              className="p-6 bg-gray-800 flex-grow overflow-y-auto"
              style={{ maxHeight: "86vh" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-white">
                  {selectedQuestion?.title || question.title}{" "}
                </h2>
                <span className="px-2 py-1 bg-green-600 rounded text-sm">
                  {selectedQuestion?.complexity || question.complexity}
                </span>
              </div>
              <ReactMarkdown className="mb-4 text-gray-300 whitespace-pre-line text-left text-base">
                {selectedQuestion?.description || question.description}
              </ReactMarkdown>
            </CardContent>
          </Card>
          {/* Chat Card */}
          <div className="flex-grow">
            <ChatCard roomId={roomId!} username={userName} userId={userId} />
          </div>
        </div>

        {/* Right Panel - Monaco Editor & Console */}
        <div className="flex flex-col gap-4">
          <Card className="border-gray-700 text-white flex flex-col h-full">
            <CardContent className="p-6 bg-gray-800 flex-grow">
              <CodeEditor />
            </CardContent>
          </Card>
        </div>
      </div>
      <CallNotification notification={notification} handleCallResponse={handleCallResponse}/>
    </div>
  );
};

export default CollaborationPage;
