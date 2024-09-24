"use client";
import Header from "@/components/Header/header";
import {
  Button,
  Col,
  Input,
  Layout,
  Row,
  Select,
  Table,
  TableProps,
  Tabs,
  Tag,
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
import { GetQuestions, Question } from "./services/question";
import {
  CategoriesOption,
  DifficultyOption,
  OrderOption,
} from "./utils/SelectOptions";

export default function Home() {
  // Store the questions
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);
  // Store the states related to table's loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filtering States
  const [categories, setCategories] = useState<String[]>([]); // Store the selected filter categories
  const [difficulty, setDifficulty] = useState<String>(""); // Store the selected difficulty level
  const [order, setOrder] = useState<String>(""); // Store the selected sorting order (Newest/Oldest) aka ASC/DESC

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }

    GetQuestions().then((data) => {
      setQuestions(data);
      setIsLoading(false);
    });
  }, []);

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
      render: (id: number) => (
        <div>
          {/* TODO (Sean): Include Logic to handle retrieving of editable data here and display in a modal component */}
          <Button className="edit-button" icon={<EditOutlined />}></Button>
          {/* TODO (Ryan): Include Pop-up confirmation for delete when clicked and link to delete API --> can also explore success notification or look into react-toast*/}
          <Button
            className="delete-button"
            danger
            icon={<DeleteOutlined />}
          ></Button>
        </div>
      ),
    },
  ];

  // HandleChange for Multi-select Categories Option
  const handleCategoriesChange = (value: string[]) => {
    setCategories(value);
  };

  return (
    <div>
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
              <Row gutter={16}>
                <Col span={6}>
                  <Input
                    placeholder="Search Question Title"
                    prefix={<SearchOutlined />}
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
                  />
                </Col>
                <Col span={4}>
                  <Select
                    allowClear
                    placeholder="Difficulty"
                    onChange={(value: string) => setDifficulty(value)}
                    options={DifficultyOption}
                    className="difficulty-select"
                  />
                </Col>
                <Col span={4}>
                  <Select
                    allowClear
                    placeholder="Recent"
                    onChange={(value: string) => setOrder(value)}
                    options={OrderOption}
                    className="order-select"
                  />
                </Col>
                <Col span={4}>
                  <Button>Clear</Button>
                  <Button type="primary" className="filter-button">
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
    </div>
  );
}
