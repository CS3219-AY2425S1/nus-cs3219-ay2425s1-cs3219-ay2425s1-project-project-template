"use client";

import { useSearchParams } from "next/navigation";

const QuestionPage = (): JSX.Element => {
  const searchParams = useSearchParams();
  const docRefId = searchParams.get("data");

  // TODO: use docRefId to fetch the data via the service function and display the data below
  return <div>Hello World! {docRefId}</div>;
};

export default QuestionPage;
