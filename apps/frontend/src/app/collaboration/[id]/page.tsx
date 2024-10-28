"use client";
import Header from "@/components/Header/header";
import {
  Button,
  Col,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Tabs,
  TabsProps,
  Tag,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import "./styles.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GetSingleQuestion, Question } from "@/app/services/question";
import {
  ClockCircleOutlined,
  CodeOutlined,
  FileDoneOutlined,
  InfoCircleFilled,
  MessageOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { ProgrammingLanguageOptions } from "@/utils/SelectOptions";
import CollaborativeEditor, {
  CollaborativeEditorHandle,
} from "@/components/CollaborativeEditor/CollaborativeEditor";

interface CollaborationProps {}

export default function CollaborationPage(props: CollaborationProps) {
  const router = useRouter();

  const editorRef = useRef<CollaborativeEditorHandle>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Code Editor States
  const [questionTitle, setQuestionTitle] = useState<string | undefined>(
    undefined
  );
  const [complexity, setComplexity] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]); // Store the selected filter categories
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript"); // State to hold the selected language item

  // Session states
  const [collaborationId, setCollaborationId] = useState<string | undefined>(
    undefined
  );
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);
  const [matchedUser, setMatchedUser] = useState<string>("Loading...");
  const [sessionDuration, setSessionDuration] = useState<number>(() => {
    const storedTime = localStorage.getItem("session-duration");
    return storedTime ? parseInt(storedTime) : 0;
  }); // State for count-up timer (TODO: currently using localstorage to store time, change to db stored time in the future)
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  // Chat states
  const [messageToSend, setMessageToSend] = useState<string | undefined>(
    undefined
  );

  // Manual test case states
  const [manualTestCase, setManualTestCase] = useState<string | undefined>(
    undefined
  );

  // End Button Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Session End Modal State
  const [isSessionEndModalOpen, setIsSessionEndModalOpen] =
    useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(5);

  // Stops the session duration stopwatch
  const stopStopwatch = () => {
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
    }
  };

  // Starts the session duration stopwatch
  const startStopwatch = () => {
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
    }

    stopwatchRef.current = setInterval(() => {
      setSessionDuration((prevTime) => {
        const newTime = prevTime + 1;
        localStorage.setItem("session-duration", newTime.toString());
        return newTime;
      });
    }, 1000);
  };

  // Convert seconds into time of format "hh:mm:ss"
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9 ? minutes : "0" + minutes) +
      ":" +
      (secs > 9 ? secs : "0" + secs)
    );
  };

  // Fetch the question on initialisation
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }

    // Retrieve details from localstorage
    const docRefId: string = localStorage.getItem("docRefId") ?? "";
    const collabId: string = localStorage.getItem("collabId") ?? "";
    const matchedUser: string = localStorage.getItem("matchedUser") ?? "";
    const currentUser: string = localStorage.getItem("user") ?? "";

    // Set states from localstorage
    setCollaborationId(collabId);
    setMatchedUser(matchedUser);
    setCurrentUser(currentUser);

    // Fetch question and set question states
    GetSingleQuestion(docRefId).then((data: Question) => {
      setQuestionTitle(`${data.id}. ${data.title}`);
      setComplexity(data.complexity);
      setCategories(data.categories);
      setDescription(data.description);
    });

    // Start stopwatch
    startStopwatch();
  }, []);

  // useEffect for timer
  useEffect(() => {
    if (isSessionEndModalOpen && countDown > 0) {
      const timer = setInterval(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);

      return () => clearInterval(timer); // Clean up on component unmount or when countdown changes
    } else if (countDown === 0) {
      router.push("/matching"); // Redirect to matching page
    }
  }, [isSessionEndModalOpen, countDown]);

  // Tabs component items for testcases
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Case 1",
      children: (
        <Input.TextArea disabled placeholder="Insert Test Case 1" rows={6} />
      ), // TODO: Setup test-cases in db for each qn and pull/paste here
    },
    {
      key: "2",
      label: "Case 2",
      children: (
        <Input.TextArea disabled placeholder="Insert Test Case 2" rows={6} />
      ),
    },
    {
      key: "3",
      label: "Case 3",
      children: (
        <Input.TextArea
          onChange={(e) => setManualTestCase(e.target.value)}
          placeholder="Input Manual Test Case"
          rows={6}
        />
      ),
    },
  ];

  // Handles the cleaning of localstorage variables, stopping the timer & signalling collab user on webrtc
  // type: "initiator" | "peer"
  const handleCloseCollaboration = (type: string) => {
    // Stop stopwatch
    stopStopwatch();
    if (editorRef.current && type === "initiator") {
      editorRef.current.endSession(); // Call the method on the editor
    }

    // Trigger modal open showing session end details
    setIsSessionEndModalOpen(true);

    // Remove localstorage variables for collaboration
    localStorage.removeItem("session-duration"); // TODO: Remove this after collaboration backend data stored
    localStorage.removeItem("user");
    localStorage.removeItem("collabId");
    localStorage.removeItem("docRefId");
    localStorage.removeItem("matchedUser");
  };

  return (
    <Layout className="collaboration-layout">
      <Header selectedKey={undefined} />
      <Content className="collaboration-content">
        <Modal
          height={500}
          title={"Session Ended"}
          footer={null}
          open={isSessionEndModalOpen}
          width={400}
          closable={false}
        >
          <p className="session-modal-description">
            The collaboration session has ended. You will be redirected in{" "}
            {countDown} seconds
          </p>
          <p className="session-modal-question">
            Question:{" "}
            <span className="session-modal-title">{questionTitle}</span>
          </p>
          <p className="session-modal-difficulty">
            Difficulty:{" "}
            <Tag
              className="complexity-tag"
              style={{
                color:
                  complexity === "easy"
                    ? "#2DB55D"
                    : complexity === "medium"
                    ? "orange"
                    : "red",
              }}
            >
              {complexity &&
                complexity.charAt(0).toUpperCase() + complexity.slice(1)}
            </Tag>
          </p>
          <p className="session-modal-duration">
            Duration:{" "}
            <span className="session-modal-time">
              {formatTime(sessionDuration)}
            </span>
          </p>
          <p className="session-modal-matched-user">
            Matched User:{" "}
            <span className="session-modal-matched-user-name">
              {matchedUser}
            </span>
          </p>
        </Modal>
        <Row gutter={0} className="collab-row">
          <Col span={7} className="first-col">
            <Row className="question-row">
              <div className="question-container">
                <div className="question-title">{questionTitle}</div>
                <div className="question-difficulty">
                  <Tag
                    className="complexity-tag"
                    style={{
                      color:
                        complexity === "easy"
                          ? "#2DB55D"
                          : complexity === "medium"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {complexity &&
                      complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                  </Tag>
                </div>
                <div className="question-topic">
                  <span className="topic-label">Topics: </span>
                  {categories.map((category) => (
                    <Tag key={category}>{category}</Tag>
                  ))}
                </div>
                <div className="question-description">{description}</div>
              </div>
            </Row>
            <Row className="test-row">
              <div className="test-container">
                <div className="test-top-container">
                  <div className="test-title">
                    <FileDoneOutlined className="title-icons" />
                    Test Cases
                  </div>
                  {/* TODO: Link to execution service for running code against test-cases */}
                  <Button
                    icon={<PlayCircleOutlined />}
                    iconPosition="end"
                    className="test-case-button"
                  >
                    Run Test Cases
                  </Button>
                </div>
                <div className="test-cases-container">
                  <Tabs items={items} defaultActiveKey="1" />
                </div>
              </div>
            </Row>
          </Col>
          <Col span={11} className="second-col">
            <Row className="code-row">
              <div className="code-container">
                <div className="code-top-container">
                  <div className="code-title">
                    <CodeOutlined className="title-icons" />
                    Code
                  </div>
                  {/* TODO: Link to execution service for code submission */}
                  <Button
                    icon={<SendOutlined />}
                    iconPosition="end"
                    className="code-submit-button"
                  >
                    Submit
                  </Button>
                </div>
                {collaborationId && currentUser && selectedLanguage && (
                  <CollaborativeEditor
                    ref={editorRef}
                    user={currentUser}
                    collaborationId={collaborationId}
                    language={selectedLanguage}
                    setMatchedUser={setMatchedUser}
                    handleCloseCollaboration={handleCloseCollaboration}
                  />
                )}
              </div>
            </Row>
          </Col>
          <Col span={6} className="third-col">
            <Row className="session-row">
              <div className="session-container">
                <div className="session-top-container">
                  <div className="session-title">
                    <ClockCircleOutlined className="title-icons" />
                    Session Details
                  </div>
                  <Modal
                    height={500}
                    title={"End Session"}
                    okText={"End"}
                    okButtonProps={{ danger: true }}
                    onOk={() => handleCloseCollaboration("initiator")}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    width={400}
                  >
                    <p className="modal-description">
                      Are you sure you want to quit the existing collaboration
                      session? This will end the session for both users!
                    </p>
                  </Modal>
                  <Button
                    danger
                    onClick={() => setIsModalOpen(true)}
                    className="session-end-button"
                  >
                    End for All
                  </Button>
                </div>

                <div className="session-duration">
                  Duration:
                  <span className="session-duration-timer">
                    {formatTime(sessionDuration)}
                  </span>
                </div>
                <div className="session-matched-user-label">
                  Matched User:
                  <span className="session-matched-user-name">
                    {matchedUser}
                  </span>
                </div>
              </div>
            </Row>
            <Row className="chat-row">
              <div className="chat-container">
                <div className="chat-title">
                  <MessageOutlined className="title-icons" />
                  Chat
                </div>

                <div className="chat-message-box">
                  <div className="chat-header-message">
                    Matched with {matchedUser}
                  </div>
                  {/* TODO: Map and input the history of messages sent here */}
                  <div></div>
                </div>
                <div className="chat-typing-box">
                  <Input.TextArea
                    onChange={(e) => setMessageToSend(e.target.value)}
                    placeholder="Send Message Here"
                    rows={4}
                  />
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
