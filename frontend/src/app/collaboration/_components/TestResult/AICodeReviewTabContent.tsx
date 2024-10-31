"use client";
import { useEffect, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AICodeReviewTabContent() {
  const { codeReview } = useSessionContext();
  const { codeReviewResult, isGeneratingCodeReview, generateCodeReview } = codeReview;

  const [animatedText, setAnimatedText] = useState("");
  const typingSpeed = 10;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isGeneratingCodeReview && codeReviewResult.header && codeReviewResult.header !== "No code review available") {
      setAnimatedText(codeReviewResult.header[0] || "");
      let currentIndex = 1;

      const intervalId = setInterval(() => {
        if (currentIndex >= codeReviewResult.header.length) {
          clearInterval(intervalId);
          return;
        }
        setAnimatedText((prev) => prev + codeReviewResult.header[currentIndex]);
        currentIndex += 1;
      }, typingSpeed);

      return () => clearInterval(intervalId);
    } else {
      setAnimatedText("No code review available");
    }
  }, [codeReviewResult.header, isGeneratingCodeReview]);

  // Automatically scroll to the bottom as text animates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [animatedText]);

  const renderCodeReviewText = () => {
    if (isGeneratingCodeReview) {
      return (
        <div className="flex items-center space-x-2">
          <LoadingSpinner />
          <span className="font-semibold">Reviewing your code...</span>
        </div>
      );
    }
    return <ReactMarkdown>{animatedText}</ReactMarkdown>;
  };

  return (
    <div className="h-full flex flex-col p-2">
      <div
        ref={scrollRef}
        className="flex-1 bg-background-200 rounded-sm p-2 overflow-y-scroll max-h-72"
      >
        {renderCodeReviewText()}
      </div>
      <div className="mt-5 self-end">
        <Button
          className="items-center space-x-2 p-2"
          onClick={generateCodeReview}
        >
          <Sparkles size={16} color="#FFFF00" />
          <span className="font-semibold">Ask AI</span>
        </Button>
      </div>
    </div>
  );
}
