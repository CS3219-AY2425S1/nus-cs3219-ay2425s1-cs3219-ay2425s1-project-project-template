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
  const matcher = useContext(WebSocketContext)! // ! is a null-check
  let button;
  switch (matcher.state) {
    case "closed":
      button = <Button onClick={matcher.start}>Start Match</Button>
      break;

    case "matching":
      button = <Button onClick={matcher.cancel}>Stop Match</Button>
      break;

    case "cancelling":
    case "starting":
      button = <Button loading>{matcher.state}</Button>
      break;
      
    // case "ready":
    //   button = <Button disabled>Ok</Button>
    //   break;
  }
  

  return (
    <Layout className="layout">
      <Header selectedKey={["0"]} />
        <Content className="content">
          {button}
          {"found" in matcher && <Button onClick={matcher.ok}>Found: {matcher.found}</Button>}
          <p>{matcher.state.toUpperCase()}</p>
        </Content>
    </Layout>
  )
}