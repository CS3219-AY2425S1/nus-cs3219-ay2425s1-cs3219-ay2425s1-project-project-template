"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function AICodeReviewTabContent() {
  const { currentCode }  = useSessionContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const submitCodeReview = () => {
    console.log(currentCode)
    setIsLoading(true)
    // const result = await createCodeReview(currentCode);
  };

  const renderCodeReviewText = () => {
    if (isLoading) {
      return (
        <div className="flex flex-row space-x-2">
          <LoadingSpinner />
          <span className="text-semibold">Reviewing your code</span>
        </div>
      );
    }
    if (currentCode) {
      return currentCode
    }
    return "No code review available";
  };

  return (
    <div className="h-full relative p-2 ">
      <div className="h-5/6 bg-background-200 rounded-sm p-2">{renderCodeReviewText()}</div>
      <Button className="items-center space-x-2 p-2 absolute bottom-3 right-3" onClick={submitCodeReview}>
        <Sparkles size={16} color="#FFFF00" />
        <span className="font-semibold">Ask AI</span>
      </Button>
    </div>
  );
}
