import { FC , useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@mui/material';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import PeopleIcon from "@mui/icons-material/People";
import CodeEditor from '../../components/Collaboration/codeEditor';

import { Question } from "../Question/question";
import LeaveRoomModal from "./leaveRoomModal";
import QuestionSelectModal from "./questionSelectModal";

const CollaborationPage: FC = () => {
  const location = useLocation();
  const { roomId, userId, question } = location.state;
  const [isLeaveRoomModalOpen, setIsLeaveRoomModalOpen] = useState<boolean>(false);
  const [isChangeQuestionModalOpen, setIsChangeQuestionModalOpen] = useState(false);

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
  const onLeaveRoom = () => {}
  const handleQuestionChangeClick = () => setIsChangeQuestionModalOpen(true);
  const handleChangeQuestionModalClose = () =>
    setIsChangeQuestionModalOpen(false);
  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setIsChangeQuestionModalOpen(false); // Close the modal after selection
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <Box>
        <AppBar position="static" sx={{ width: "100vw", backgroundColor: "#262928" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <img className="h-12 mr-6" alt="peerprep logo" src="/logo-with-text.svg" />
              {/* Flexible space to push buttons to the right */}
              <Box sx={{ flexGrow: 1 }} />
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
            <CardContent className="p-6 bg-gray-800 flex-grow">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedQuestion?.title || question.title}{" "}
                </h2>
                <span className="px-2 py-1 bg-green-600 rounded text-sm">
                  {selectedQuestion?.complexity || question.complexity}
                </span>
              </div>
              <p className="mb-4 text-gray-300 whitespace-pre-line text-left">
                {selectedQuestion?.description || question.description}
              </p>
            </CardContent>
          </Card>
          {/* Chat Card */}
          {/* TODO: CHAT */}
        </div>

        {/* Right Panel - Monaco Editor & Console */}
        <div className="flex flex-col gap-4">
          {/* Monaco Editor */}
            <CodeEditor />
          {/* Console Output */}

        </div>
      </div>
    </div>
  );
};

export default CollaborationPage;