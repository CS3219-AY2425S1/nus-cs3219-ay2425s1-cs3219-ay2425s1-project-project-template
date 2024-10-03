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
  Modal,
  Form,
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
import Link from "next/link";
import TextArea from "antd/es/input/TextArea";
import { title } from "process";

type InputFields = {
  email?: string
  password?: string
  confirmPassword?: string
}

export default function Home() {
  return (
    <div>
      <Layout>
        <Header/>
        <Content>
          <div className="login-card">
            <h1>Register</h1>

            <Form
              name="basic"
              style={{ margin: "auto" }}
            >
              <Form.Item<InputFields>
                name="email"  
                rules={[{required: true}]}
              >
                <Input
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item<InputFields>
                name="password"  
                rules={[{required: true}]}
              >
                <Input
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item<InputFields>
                name="confirmPassword"
                rules={[{required: true}]}
              >
                <Input
                  placeholder="Confirm Password"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary">
                  Register
                </Button>
              </Form.Item>
            </Form>
            <p>
              Let me <Link
                href="/login"
              >login</Link>
            </p>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
