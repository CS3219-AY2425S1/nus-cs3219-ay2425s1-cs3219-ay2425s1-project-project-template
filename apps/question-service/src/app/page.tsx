"use client";
import Header from "@/components/Header/header";
import {
  Button,
  Col,
  Input,
  Layout,
  message,
  Pagination,
  PaginationProps,
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

  // Include States for Create/Edit Modal (TODO: Sean)

  // When the page is initialised, fetch all the questions and display in table
  // When the dependencies/states change, the useEffect hook will trigger to re-fetch the questions
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }

    GetQuestions(currentPage, limit, sortBy, difficulty, delayedSearch).then(
      (data) => {
        setQuestions(data.questions);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLimit(data.limit);
        setIsLoading(false);
      }
    );
  }, [limit, currentPage, sortBy, difficulty, delayedSearch]); // TODO: (Ryan) Add dependencies for categories and edit the GetQuestion service function

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
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setCurrentPage(current);
    setLimit(pageSize);
  };

  // Handler for change in page jumper
  const onPageJump: PaginationProps["onChange"] = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                    allowClear
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
                <Col span={6}>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Difficulty"
                    onChange={(value: string[]) => {
                      setDifficulty(value);
                      setCurrentPage(1); //Reset the currentpage since filter params changed
                    }}
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
                <Col span={2}>
                  <Button onClick={handleClear} className="clear-button">
                    Clear
                  </Button>
                  {/* <Button
                    type="primary"
                    className="filter-button"
                    onClick={handleFilter}
                  >
                    Filter
                  </Button> */}
                </Col>
              </Row>
            </div>
            <div className="content-table">
              <Table
                dataSource={questions}
                columns={columns}
                loading={isLoading}
                pagination={{
                  current: currentPage,
                  total: totalCount,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  // showQuickJumper: true,
                  onChange: onPageJump,
                }}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
