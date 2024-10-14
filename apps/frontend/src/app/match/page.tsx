"use client";
import {
  Button,
  Layout,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Header from "@/components/Header/header"
import "./styles.scss";
import { useContext } from "react";
import { WebSocketContext } from "@/contexts/websocketcontext";

export default function ProfilePage(): JSX.Element {
  const {open, toggle} = useContext(WebSocketContext)! // ! is a null-check
  return (
    <Layout className="layout">
      <Header selectedKey={["0"]} />
        <Content className="content">
          <Button onClick={toggle}>Toggle me</Button>
          <p>{open ? "OPEN" : "CLOSE"}</p>
        </Content>
    </Layout>
  )
}