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
import {loginUser} from '@/app/services/user'
import {setToken} from '@/app/services/login-store'

type InputFields = {
  email?: string
  password?: string
}

export default function Home() {
  function submitDetails({email, password}: InputFields): void {
    if (!email || email === "" ||
      !password || password === ""
    ) {
      return;
    }
    loginUser(email, password).then(jwt => {
      console.log("login successful");
      setToken(jwt);
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <div>
      <Layout>
        <Header/>
        <Content>
          <div className="login-card">
            <h1>Login</h1>
            <Form
              name="basic"
              onFinish={submitDetails}
            >
              <Form.Item<InputFields>
                name="email"  
                rules={[{
                    required: true, 
                    message: "Please provide your email."
                  }]}
              >
                <Input
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item<InputFields>
                name="password"  
                rules={[{
                  required: true, 
                  message: "Please enter your password."
                }]}
              >
                <Input.Password
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
            <p>
              Let me <Link
                href="/register"
              >register</Link>
            </p>
          </div>
        </Content>
      </Layout>
    </div>
  );
}
