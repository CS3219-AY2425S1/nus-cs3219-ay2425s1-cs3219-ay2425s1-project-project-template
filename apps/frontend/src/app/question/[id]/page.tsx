"use client";
import Header from "@/components/Header/header";
import { Col, Layout, message, Row, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { CodeOutlined, HistoryOutlined } from "@ant-design/icons";
import "./styles.scss";
import { useEffect, useRef, useState } from "react";
import { GetSingleQuestion } from "../../services/question";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { QuestionDetailFull } from "@/components/question/QuestionDetailFull/QuestionDetailFull";
import { Compartment, EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { GetHistory, GetUserQuestionHistories } from "@/app/services/history";
import { ValidateUser, VerifyTokenResponseType } from "@/app/services/user";

interface Submission {
  submittedAt: string;
  language: string;
  matchedUser: string;
  code: string;
  historyDocRefId: string;
}

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
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [userQuestionHistories, setUserQuestionHistories] =
    useState<History[]>();
  const [submission, setSubmission] = useState<Submission>();
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<
    string | undefined
  >(undefined);

  const state = EditorState.create({
    doc: "",
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
  }, [docRefId]);

  useEffect(() => {
    if (username === undefined) return;
    GetUserQuestionHistories(username, docRefId)
      .then((data: any) => {
        console.log(data);
        setUserQuestionHistories(data);
      })
      .finally(() => {
        setIsHistoryLoading(false);
      });
  }, [username]);

  useEffect(() => {
    ValidateUser().then((data: VerifyTokenResponseType) => {
      setUsername(data.data.username);
    });
  }, []);

  useEffect(() => {
    if (currentSubmissionId === undefined) return;

    const view = new EditorView({
      state,
      parent: editorRef.current || undefined,
    });

    // TODO: get from a specific history which was selected.
    // Show latest history by default, or load specific history
    GetHistory(currentSubmissionId).then((data: any) => {
      const submittedAt = new Date(data.createdAt);
      setSubmission({
        submittedAt: submittedAt.toLocaleString("en-US"),
        language: data.language,
        matchedUser:
          username == data.matchedUser ? data.User : data.matchedUser,
        code: data.code,
        historyDocRefId: data.historyDocRefId,
      });

      view.dispatch(
        state.update({
          changes: { from: 0, to: state.doc.length, insert: data.code },
        })
      );
    });

    return () => {
      // Cleanup on component unmount
      view.destroy();
    };
  }, [currentSubmissionId]);

  const columns = [
    {
      title: "Submitted at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        return new Date(date).toLocaleString();
      },
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

  const handleRowClick = (s: Submission) => {
    setCurrentSubmissionId(s.historyDocRefId);
  };

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
                      dataSource={userQuestionHistories}
                      columns={columns}
                      onRow={(record: any) => {
                        return {
                          onClick: () => handleRowClick(record),
                          style: { cursor: "pointer" },
                        };
                      }}
                      scroll={{ y: "max-content" }}
                      loading={isHistoryLoading}
                    />
                  </div>
                </div>
              </Row>
              {currentSubmissionId && (
                <Row className="code-row">
                  <div className="code-container">
                    <>
                      <div className="code-top-container">
                        <div className="code-title">
                          <CodeOutlined className="title-icons" />
                          Submitted Code
                        </div>
                      </div>

                      {/* Details of submission */}
                      <div
                        style={{
                          margin: "10px",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div className="submission-header-detail">
                          Submitted at: {submission?.submittedAt || "-"}
                        </div>
                        <div className="submission-header-detail">
                          Language: {submission?.language || "-"}
                        </div>
                        <div className="submission-header-detail">
                          Matched with: {submission?.matchedUser || "-"}
                        </div>
                      </div>

                      {/* Code Editor */}
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
                        ></div>
                      </div>
                    </>
                  </div>
                </Row>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
}
