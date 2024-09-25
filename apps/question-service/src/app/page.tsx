"use client";
import Header from "@/components/Header/header";
import {
  Button,
  Col,
  Input,
  Layout,
  message,
  Row,
  Select,
  Table,
  TableProps,
  Tabs,
  Tag,
  Modal
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import { useEffect, useState } from "react";
import { DeleteQuestion as DeleteQuestionByDocref, GetQuestions, Question } from "./services/question";
import {
  CategoriesOption,
  DifficultyOption,
  OrderOption,
} from "./utils/SelectOptions";

type DeletionStage = {} | {index: number, deleteConfirmed: boolean}

function DeleteModal({questionTitle, okHandler, cancelHandler}: {questionTitle: string, okHandler: () => void, cancelHandler: () => void}) {
  const title: string = `Delete Question \"${questionTitle}\"?`
  const text: string = 'This action is irreversible(?)!' 

  return <Modal title={title} onOk={okHandler} onCancel={cancelHandler}>
    <p>{text}</p>
  </Modal>
}

export default function Home() {

  // State of Deletion
  const [deletionStage, setDeletionStage] = useState<DeletionStage>({})

  // Table States
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined); // Store the questions
  const [isLoading, setIsLoading] = useState<boolean>(true); // Store the states related to table's loading

  // Filtering States
  const [search, setSearch] = useState<string | undefined>(undefined); // Store the search
  const [categories, setCategories] = useState<string[]>([]); // Store the selected filter categories
  const [difficulty, setDifficulty] = useState<string[]>([]); // Store the selected difficulty level
  const [sortBy, setSortBy] = useState<string | undefined>(undefined); // Store the selected sorting parameter

  // Message States
  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const warning = (message: string) => {
    messageApi.open({
      type: "warning",
      content: message,
    });
  };

  async function deleteQuestion(q: Question) {
    await DeleteQuestionByDocref(q.docRefId);
    loadQuestions();
  }

  function loadQuestions() {
    if (!isLoading) {
      setIsLoading(true);
    }

    GetQuestions().then((data) => {
      setQuestions(data);
      setIsLoading(false);
    });
  };
  // Include States for Create/Edit Modal (TODO: Sean)

  // When the page is initialised, fetch all the questions ONCE and display in table
  useEffect(loadQuestions, []);

  // Table column specification
  const columns: TableProps<Question>["columns"] = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      // render: (id: number) => <div>{id}</div>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Button type="link">{text}</Button>, // TODO (Sean): Onclick links to the individual question page
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories: string[]) =>
        categories.map((category) => <Tag>{category}</Tag>),
    },
    {
      title: "Difficulty",
      dataIndex: "complexity",
      key: "complexity",
      render: (difficulty: string) => {
        let color = "";
        if (difficulty === "Easy") {
          color = "#2DB55D";
        } else if (difficulty === "Medium") {
          color = "orange";
        } else if (difficulty === "Hard") {
          color = "red";
        }
        return <div style={{ color }}>{difficulty}</div>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "id",
      render: (id: string) => (
        <div>
          {/* TODO (Sean): Include Logic to handle retrieving of editable data here and display in a modal component */}
          <Button className="edit-button" icon={<EditOutlined />}></Button>
          {/* TODO (Ryan): Include Pop-up confirmation for delete when clicked and link to delete API --> can also explore success notification or look into react-toast*/}
          <Button
            className="delete-button"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              if (questions == undefined) {
                throw new Error()
              }
              let toDelete = questions.findIndex(row => row.id == id)
              if (toDelete == -1) {
                throw new Error("could not find id")
              }
              setDeletionStage({index: toDelete, deleteConfirmed: false})}
            }
          ></Button>
        </div>
      ),
    },
  ];

  // Handler for change in multi-select categories option
  const handleCategoriesChange = (value: string[]) => {
    setCategories(value);
  };

  // Handler for clearing the filtering options
  const handleClear = () => {
    setCategories([]);
    setDifficulty([]);
    setSearch(undefined);
    setSortBy(undefined);
  };

  // Handler for filtering (TODO)
  const handleFilter = async () => {
    success("Filtered Successfully!");
  };

  return (
    <div>
      {contextHolder}
      <Layout className="layout">
        <Header />
        <Content className="content">
          <div className="content-card">
            <div className="content-row-1">
              <div className="content-title">Problems</div>
              <div className="create-button">
                {/* TODO (Sean): Launch a popup modal that links to the backend api to create a new entry in db, --> look into success/error notification/react toast */}
                <Button type="primary" icon={<PlusCircleOutlined />}>
                  Create New Problem
                </Button>
              </div>
            </div>
            {/* TODO (Ben/Ryan): Include and link search & filter parameters */}
            <div className="content-filter">
              <Row gutter={8}>
                <Col span={6}>
                  <Input
                    placeholder="Search Question Title"
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                </Col>
                <Col span={6}>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Categories"
                    onChange={handleCategoriesChange}
                    options={CategoriesOption}
                    className="categories-multi-select"
                    value={categories}
                  />
                </Col>
                <Col span={4}>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Difficulty"
                    onChange={(value: string[]) => setDifficulty(value)}
                    options={DifficultyOption}
                    className="difficulty-select"
                    value={difficulty}
                  />
                </Col>
                <Col span={4}>
                  <Select
                    allowClear
                    placeholder="Sort By"
                    onChange={(value: string) => setSortBy(value)}
                    options={OrderOption}
                    className="order-select"
                    value={sortBy}
                  />
                </Col>
                <Col span={4}>
                  <Button onClick={handleClear}>Clear</Button>
                  <Button
                    type="primary"
                    className="filter-button"
                    onClick={handleFilter}
                  >
                    Filter
                  </Button>
                </Col>
              </Row>
            </div>
            <div className="content-table">
              <Table
                dataSource={questions}
                columns={columns}
                loading={isLoading}
              />
            </div>
          </div>
        </Content>
      </Layout>
      {("index" in deletionStage && questions != undefined) && <DeleteModal 
        okHandler={() => {
          if (!("index" in deletionStage)) {
            error("Cannot delete: no index");
            return;
          }
          if (deletionStage.deleteConfirmed) {
            error("Cannot delete: still deleting");
            return;
          }

          deleteQuestion(questions[deletionStage.index]).catch(err => {
            error(err);
          })
        }} 
        cancelHandler={() => setDeletionStage({})}
        questionTitle={questions[deletionStage.index].title}/>}
    </div>
  );
}
