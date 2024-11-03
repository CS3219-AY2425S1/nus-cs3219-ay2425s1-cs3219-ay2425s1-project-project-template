"use client";
import Header from "@/components/Header/header";
import {
  Button,
  Col,
  Layout,
  message,
  Row,
  Tag,
  Select,
  Table,
  Input,
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  LeftOutlined,
  RightOutlined,
  CaretRightOutlined,
  CodeOutlined,
  SendOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import { useEffect, useRef, useState } from "react";
import { GetSingleQuestion } from "../../services/question";
import React from "react";
import TextArea from "antd/es/input/TextArea";
import { useSearchParams } from "next/navigation";
import { ProgrammingLanguageOptions } from "@/utils/SelectOptions";
import { useRouter } from "next/navigation";
import { QuestionDetailFull } from "@/components/question/QuestionDetailFull/QuestionDetailFull";
import CollaborativeEditor, {
  CollaborativeEditorHandle,
} from "@/components/CollaborativeEditor/CollaborativeEditor";
import { WebrtcProvider } from "y-webrtc";
import { Compartment, EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function QuestionPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true); // Store the states related to table's loading

  // Message States
  const [messageApi, contextHolder] = message.useMessage();

  const error = (message: string) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const router = useRouter();
  const editorRef = useRef(null);
  const providerRef = useRef<WebrtcProvider | null>(null);
  const languageConf = new Compartment();

  // Retrieve the docRefId from query params during page navigation
  const searchParams = useSearchParams();
  const docRefId: string = searchParams?.get("data") ?? "";
  // Code Editor States
  const [questionTitle, setQuestionTitle] = useState<string | undefined>(
    undefined
  );
  const [complexity, setComplexity] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]); // Store the selected filter categories
  const [description, setDescription] = useState<string | undefined>(undefined);

  const state = EditorState.create({
    doc: "TODO: parse from code",
    extensions: [
      basicSetup,
      languageConf.of(javascript()),
      EditorView.theme({
        "&": { height: "100%", overflow: "hidden" }, // Enable scroll
      }),
    ],
  });

  // When code editor page is initialised, fetch the particular question, and display in code editor
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }

    GetSingleQuestion(docRefId)
      .then((data: any) => {
        setQuestionTitle(data.title);
        setComplexity(data.complexity);
        setCategories(data.categories);
        setDescription(data.description);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const view = new EditorView({
      state,
      parent: editorRef.current || undefined,
    });

    return () => {
      // Cleanup on component unmount
      view.destroy();
    };
  }, [docRefId]);

  // TODO: retrieve history
  const history: any[] = [];

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Attempted at",
      dataIndex: "attemptedAt",
      key: "attemptedAt",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Matched with",
      dataIndex: "matchedUser",
      key: "matchedUser",
    },
  ];

  return (
    <div>
      {contextHolder}
      <Layout className="question-layout">
        <Header selectedKey={undefined} />
        <Content className="question-content">
          <Row gutter={0} className="question-row">
            <Col span={12} className="first-col">
              <QuestionDetailFull
                questionTitle={questionTitle}
                complexity={complexity}
                categories={categories}
                description={description}
                testcaseItems={undefined}
              />
            </Col>
            <Col span={12} className="second-col">
              <Row className="history-row">
                <div className="history-container">
                  <div className="history-top-container">
                    <div className="history-title">
                      <HistoryOutlined className="title-icons" />
                      Submission History
                    </div>
                  </div>
                  <div style={{ margin: "10px" }}>
                    <Table
                      rowKey="id"
                      dataSource={history}
                      columns={columns}
                      loading={isLoading}
                    />
                  </div>
                </div>
              </Row>
              <Row className="code-row">
                <div className="code-container">
                  <div className="code-top-container">
                    <div className="code-title">
                      <CodeOutlined className="title-icons" />
                      Submitted Code
                    </div>
                  </div>

                  {/* TODO: add details of attempt here */}
                  {/* TODO: set value of code, refactor to look like collab editor but not editable */}
                  <div
                    style={{
                      margin: "10px",
                      height: "40vh",
                    }}
                  >
                    <div
                      ref={editorRef}
                      style={{
                        height: "100%",
                        overflow: "scroll",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                </div>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
}
