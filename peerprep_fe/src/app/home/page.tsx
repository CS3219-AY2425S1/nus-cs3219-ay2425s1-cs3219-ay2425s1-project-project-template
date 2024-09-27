"use client";

import Header from "@/components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/modal.css";
import React, { useState } from "react";
import { QuestionForm } from "@/components/question-form";
import Button from "@/components/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    alert(token);

    if (!token) {
      router.push("/auth/login");
    }
    // TODO: Validate token is still valid
  });

  const [addQns, setAddQns] = useState(false);

  const toggleAddQns = () => {
    setAddQns(!addQns);
  };

  if(addQns) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
 

  return (
    <div className="h-screen w-screen flex flex-col max-w-6xl mx-auto py-10">
      <Header>
        <Button
          text="Logout"
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
        />
      </Header>
      Home Page
        <Button type="submit" onClick={toggleAddQns} text="Add Question" />


      {addQns && (
        <div className="modal">
          <div onClick={toggleAddQns} className="overlay"></div>
          <div className="modal-content">
          <QuestionForm />
          <Button type="reset" onClick={toggleAddQns} text="CLOSE" />
          </div>
        </div>
      )}
    </div>
  );
}

export async function logout() {
  localStorage.removeItem("token");
}
