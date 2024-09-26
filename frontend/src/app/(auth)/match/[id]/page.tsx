"use client";

import { useEffect, useState } from "react";
import QuestionPage from "./components/QuestionPage";
import useWebSocket from "react-use-websocket";
import RightPage from "./components/RightPage";



const Page = ({ params }: { params: { id: string } }) => {
  // const { sendJsonMessage, lastMessage } = useWebSocket(`ws://localhost:3000/ws/${params.id}`, {
  //   onOpen: () => console.log('Websocket connected'),
  //   share: true
  // });

  // useEffect(() => {
  //   if (!lastMessage) return;
  //   const message = JSON.parse(lastMessage.data);
  // })

  return <div className="grid grid-cols-2">
    <QuestionPage/>
    <RightPage/>
  </div>
}

export default Page;