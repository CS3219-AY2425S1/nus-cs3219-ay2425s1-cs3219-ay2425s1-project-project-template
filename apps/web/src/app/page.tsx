"use client";
import Header from "@/components/Header/header";
import { Button, Layout, Table, TableProps, Tabs, Tag } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import "./styles.scss";

interface QuestionTableData {
  id: number;
  title: string;
  description?: string;
  category: string[]; // enum[]
  complexity: string; // enum
  assets?: string[];
  createdAt?: Date; // or string
  updatedAt?: Date; // or string
  deletedAt?: Date;
  testCases?: string[];
}

export default function Home() {
  // TODO (Ben): Replace this with retrieving via backend api after backend implementation
  const sampleData: QuestionTableData[] = [
    {
      id: 1,
      title: "Two Sum",
      category: ["Array", "Hash Table"],
      complexity: "Easy",
    },
    {
      id: 2,
      title: "Add Two Numbers",
      category: ["Linked List", "Math", "Recursion"],
      complexity: "Medium",
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      category: ["String", "Sliding Window", "Hash Table"],
      complexity: "Medium",
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      category: ["Array", "Binary Search", "Divide and Conquer"],
      complexity: "Hard",
    },
    {
      id: 5,
      title: "Reverse Integer",
      category: ["Math"],
      complexity: "Easy",
    },
    {
      id: 6,
      title: "Palindrome Number",
      category: ["Math"],
      complexity: "Easy",
    },
    {
      id: 7,
      title: "Roman to Integer",
      category: ["Math", "String"],
      complexity: "Easy",
    },
    {
      id: 8,
      title: "Valid Parentheses",
      category: ["Stack", "String"],
      complexity: "Easy",
    },
    {
      id: 9,
      title: "Merge Two Sorted Lists",
      category: ["Linked List"],
      complexity: "Easy",
    },
    {
      id: 10,
      title: "Remove Duplicates from Sorted Array",
      category: ["Array", "Two Pointers"],
      complexity: "Easy",
    },
    {
      id: 11,
      title: "Container With Most Water",
      category: ["Array", "Two Pointers"],
      complexity: "Medium",
    },
    {
      id: 12,
      title: "3Sum",
      category: ["Array", "Two Pointers"],
      complexity: "Medium",
    },
    {
      id: 13,
      title: "Letter Combinations of a Phone Number",
      category: ["String", "Backtracking"],
      complexity: "Medium",
    },
    {
      id: 14,
      title: "Remove Nth Node From End of List",
      category: ["Linked List", "Two Pointers"],
      complexity: "Medium",
    },
  ];

  const columns: TableProps<QuestionTableData>["columns"] = [
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
      dataIndex: "category",
      key: "category",
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
              Include Search & Filter Component Here
            </div>
            <div className="content-table">
              <Table dataSource={sampleData} columns={columns} />
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
