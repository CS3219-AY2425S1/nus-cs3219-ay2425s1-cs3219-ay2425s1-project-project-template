"use client";
import Header from "@/components/Header/header";
import {
  Button,
  Col,
  Dropdown,
  Input,
  Layout,
  message,
  Menu,
  MenuProps,
  Pagination,
  PaginationProps,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Tabs,
  Tag,
} from "antd";
import { Content } from "antd/es/layout/layout";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  CaretRightOutlined,
  ClockCircleTwoTone,
  CloseCircleFilled,
  ClockCircleFilled,
  ClockCircleOutlined,
  CommentOutlined,
  CheckOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import { useEffect, useState } from "react";
import { GetQuestions, Question, GetSingleQuestion } from "../services/question";
import {
  CategoriesOption,
  DifficultyOption,
  OrderOption,
} from "../utils/SelectOptions";
import React from "react";
import TextArea from "antd/es/input/TextArea";

export default function Home() {
  // Table States
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined); // Store the questions
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined); // Store the total count of questions
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined); // Store the total number of pages
  const [currentPage, setCurrentPage] = useState<number | undefined>(1); // Store the current page
  const [limit, setLimit] = useState<number | undefined>(10); // Store the quantity of questions to be displayed
  const [isLoading, setIsLoading] = useState<boolean>(true); // Store the states related to table's loading

  // Filtering States
  const [search, setSearch] = useState<string | undefined>(undefined); // Store the search
  const [delayedSearch, setDelayedSearch] = useState<string | undefined>(
    undefined
  ); // Store the delayed search value
  // const [categories, setCategories] = useState<string[]>([]); // Store the selected filter categories
  const [difficulty, setDifficulty] = useState<string[]>([]); // Store the selected difficulty level
  const [sortBy, setSortBy] = useState<string | undefined>(undefined); // Store the selected sorting parameter

  // Message States
  const [messageApi, contextHolder] = message.useMessage();

  // Code Editor States
  const [questionTitle, setQuestionTitle] = useState<string | undefined>(undefined);
  const [complexity, setComplexity] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]); // Store the selected filter categories
  const [description, setDescription] = useState<string | undefined>(undefined);

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

  // Include States for Create/Edit Modal (TODO: Sean)

  // When the page is initialised, fetch all the questions and display in table
  // When the dependencies/states change, the useEffect hook will trigger to re-fetch the questions
  // useEffect(() => {
  //   if (!isLoading) {
  //     setIsLoading(true);
  //   }

  //   GetQuestions(currentPage, limit, sortBy, difficulty, delayedSearch).then(
  //     (data) => {
  //       setQuestions(data.questions);
  //       setTotalCount(data.totalCount);
  //       setTotalPages(data.totalPages);
  //       setCurrentPage(data.currentPage);
  //       setLimit(data.limit);
  //       setIsLoading(false);
  //     }
  //   );
  // }, [limit, currentPage, sortBy, difficulty, delayedSearch]); // TODO: (Ryan) Add dependencies for categories and edit the GetQuestion service function

  // When code editor page is initialised, fetch the particular question, and display in code editor
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }

    GetSingleQuestion(docRef).then(
      (data) => {
        setQuestionTitle(data.title);
        setComplexity(data.complexity);
        setCategories(data.categories);
        setDescription(data.description);
      }
    );
  })

  // Delay the fetching of data only after user stops typing for awhile
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedSearch(search);
      setCurrentPage(1); // Reset the current page
    }, 800);
    return () => clearTimeout(timeout);
  }, [search]);

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

  // Handler for change in multi-select categories option
  const handleCategoriesChange = (value: string[]) => {
    setCategories(value);
    setCurrentPage(1); // Reset the current page
  };

  // Handler for clearing the filtering options
  const handleClear = () => {
    setCategories([]);
    setDifficulty([]);
    setSearch(undefined);
    setSortBy(undefined);
  };

  // Handler for filtering (TODO)
  // const handleFilter = async () => {
  //   success("Filtered Successfully!");
  // };

  // Handler for show size change for pagination
  // const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
  //   current,
  //   pageSize
  // ) => {
  //   setCurrentPage(current);
  //   setLimit(pageSize);
  // };

  // // Handler for change in page jumper
  // const onPageJump: PaginationProps["onChange"] = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  const menuItems = [
    {
      key: '1',
      label: 'Python',
    },
    {
      key: '2',
      label: 'Java',
    },
    {
      key: '3',
      label: 'C++',
    },
  ];

  // State to hold the selected menu item
  const [selectedItem, setSelectedItem] = useState('Python');

  // Function to handle the item selection
  const handleMenuClick = (e: any) => {
    const selected = menuItems.find((item) => item.key === e.key);
    if (selected) {
      setSelectedItem(selected.label);
    }
  };

    // Menu component
    const menu = (
      <Menu onClick={handleMenuClick}>
        {menuItems.map((item) => (
          <Menu.Item key={item.key}>{item.label}</Menu.Item>
        ))}
      </Menu>
    );

  return (
    <div>
      {contextHolder}
      <Layout className="code-editor-layout">
        <Header />
        <Content className="code-editor-content">
            <Row className="entire-page">
                <Col className="col-boxes" span={8}>
                    <Row className="problem-description boxes">
                      <text className="problem-description-info">
                        <div className="problem-description-top">
                          <h3 className="problem-description-title">Problem Description</h3>
                          <text className="problem-solve-status">Solved&nbsp;<CheckCircleOutlined/></text>
                        </div>
                        <br></br>
                        <Tag>Easy</Tag>
                        <br></br>
                        <text>Topics: </text><Tag>Array</Tag><Tag>Algorithms</Tag>
                        <br></br>
                        <text>You are given two integers m and n, which represent the dimensions of a matrix.
You are also given the head of a linked list of integers.
Generate an m x n matrix that contains the integers in the linked list presented in spiral order (clockwise), starting from the top-left of the matrix. If there are remaining empty spaces, fill them with -1.
Return the generated matrix.
 
Example 1:
Input: m = 3, n = 5, head = [3,0,2,6,8,1,7,9,4,2,5,5,0] Output: [[3,0,2,6,8],[5,0,-1,-1,1],[5,2,4,9,7]] Explanation: The diagram above shows how the values are printed in the matrix. Note that the remaining spaces in the matrix are filled with -1.
Example 2:
Input: m = 1, n = 4, head = [0,1,2] Output: [[0,1,2,-1]] Explanation: The diagram above shows how the values are printed from left to right in the matrix. The last space in the matrix is set to -1.</text>
                      </text>
                    </Row>
                    <Row className="test-cases boxes">
                      <div className="test-cases-div">
                        <div className="test-cases-top">
                          <h3 className="testcase-title">Testcases</h3>
                          <Button className="runtestcases-button">Run testcases<CaretRightOutlined/></Button>
                        </div>
                        <div className="testcase-buttons">
                          <Button>Case 1</Button>
                          <Button>Case 2</Button>
                          <PlusCircleOutlined/>
                        </div>
                        <div className="testcase-code-div">
                          <TextArea className="testcase-code" placeholder="Testcases code"/>
                        </div>
                      </div>
                    </Row>
                </Col>
                <Col className="code-editor-box boxes col-boxes" span={11}>
                  <div className="code-editor-div">
                    <div className="code-editor-top">
                      <h3 className="code-editor-title"><LeftOutlined/><RightOutlined/>Code</h3>
                      <Button className="submit-solution-button">Submit Solution<CaretRightOutlined/></Button>
                    </div>
                    <div className="language-select">
                      <text>Select Language:&nbsp;
                        <Dropdown className="select-language-button" overlay={menu} trigger={['click']}>
                          <Button>{selectedItem}</Button>
                        </Dropdown>
                      </text>
                    </div>
                    <div className="code-editor-code-div">
                      <TextArea className="code-editor-code" placeholder="Insert code here"></TextArea>
                    </div>
                  </div>
                </Col>
                <Col span={5} className="col-boxes">
                    <Row className="session-details boxes">
                      <div className="session-details-div">
                        <div className="session-details-top">
                          <h3 className="session-details-title"><ClockCircleOutlined/>&nbsp;Session Details</h3>
                          <Button className="end-session-button">End</Button>
                        </div>
                        <div className="session-details-text-div">
                          <text className="session-details-text">
                            Start Time: 01:23:45<br/>
                            Session Duration: 01:23:45<br/>
                            Matched with John Doe
                          </text>
                        </div>
                      </div>
                    </Row>
                    <Row className="chat-box boxes">
                      <div className="chat-box-div">
                        <div className="chat-box-top">
                          <h3 className="chat-box-title"><CommentOutlined/>&nbsp;Chat</h3>
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
