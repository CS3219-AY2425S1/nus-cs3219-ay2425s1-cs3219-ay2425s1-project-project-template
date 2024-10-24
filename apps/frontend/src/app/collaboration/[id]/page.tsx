"use client";
import Header from "@/components/Header/header";
import {
  Button,
  Col,
  Input,
  Layout,
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
import { useEffect, useState } from "react";
import { GetSingleQuestion, Question } from "@/app/services/question";
import {
  ClockCircleOutlined,
  CodeOutlined,
  FileDoneOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { ProgrammingLanguageOptions } from "@/utils/SelectOptions";

interface CollaborationProps {}

export default function CollaborationPage(props: CollaborationProps) {
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
  const [matchedUser, setMatchedUser] = useState<string | undefined>(undefined);

  // Manual test case states
  const [manualTestCase, setManualTestCase] = useState<string | undefined>(
    undefined
  );

  // Retrieve the docRefId from query params during page navigation
  //   const searchParams = useSearchParams();

  // Fetch the question on initialisation
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }

    // Retrieve details from localstorage
    const docRefId: string = localStorage.getItem("docRefId") ?? "";
    const collabId: string = localStorage.getItem("collabId") ?? "";
    const matchedUser: string = localStorage.getItem("matchedUser") ?? "";

    // Set states from localstorage
    setCollaborationId(collabId);
    setMatchedUser(matchedUser);

    GetSingleQuestion(docRefId).then((data: Question) => {
      setQuestionTitle(`${data.id}. ${data.title}`);
      setComplexity(data.complexity);
      setCategories(data.categories);
      setDescription(data.description);
    });
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Case 1",
      children: "Insert Test Case 1", // TODO: Setup test-cases in db for each qn and pull/paste here
    },
    {
      key: "2",
      label: "Case 2",
      children: "Insert Test Case 2",
    },
    {
      key: "3",
      label: "Case 3",
      children: (
        <Input.TextArea
          onChange={(e) => setManualTestCase(e.target.value)}
          placeholder="Input Manual Test Case"
        />
      ),
    },
  ];

  return (
    <Layout className="collaboration-layout">
      <Header selectedKey={undefined} />
      <Content className="collaboration-content">
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
                  <text className="topic-label">Topics: </text>
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
                  <Button icon={<PlayCircleOutlined />} iconPosition="end">
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
                  <Button icon={<SendOutlined />} iconPosition="end">
                    Submit
                  </Button>
                </div>
                <div className="code-second-container">
                  <div className="code-language">Select Language:</div>
                  <Select
                    className="language-select"
                    defaultValue={selectedLanguage}
                    options={ProgrammingLanguageOptions}
                    onSelect={(val) => setSelectedLanguage(val)}
                  />
                </div>
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
                  <Button danger>End</Button>
                </div>

                <div className="session-duration">
                  Duration:
                  {/* TODO: Implement a count-up timer for session duration */}
                  <text className="session-duration-timer">00:00:00</text>
                </div>
                <div className="session-matched-user-label">
                  Matched User:
                  <text className="session-matched-user-name">
                    {matchedUser}
                  </text>
                </div>
              </div>
            </Row>
            <Row className="chat-row">
              <div className="chat-container">
                <div className="chat-title">
                  <MessageOutlined className="title-icons" />
                  Chat
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
