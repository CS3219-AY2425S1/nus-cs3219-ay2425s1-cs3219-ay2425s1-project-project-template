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

export default function MatchPage(): JSX.Element {
  const matcher = useContext(WebSocketContext)! // ! is a null-check

  let button;
  switch (matcher.state) {
    case "closed":
      button = <Button onClick={() => {
        matcher.start({
          "type": "match_request",
          "topics": ["Algorithms", "Arrays"],
          "difficulties": ["Easy", "Medium"]
        })
      }}>Start Match</Button>
      break;

    case "matching":
      button = <Button onClick={matcher.cancel}>Stop Match</Button>
      break;

    case "cancelling":
    case "starting":
      button = <Button loading>{matcher.state}</Button>
      break;
      
    case "found":
      button = <Button onClick={matcher.ok}>Your Partner is {matcher.info.partnerName}</Button>
      break;
      
    case "timeout":
      button = <Button onClick={matcher.ok}>Timered Out</Button>
      break;
  }
  

  return (
    <Layout className="layout">
      <Header selectedKey={["0"]} />
        <Content className="content">
          {button}
          <p>{matcher.state}</p>
        </Content>
    </Layout>
  )
}