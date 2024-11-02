"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useGetHistory } from "@/hooks/api/history";
import HistoryDescription from "@/components/history/HistoryDescription";

function HistoryContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams?.get("id");
  const idString: string = (
    Array.isArray(historyId) ? historyId[0] : historyId
  ) as string;
  const { data: history, isLoading, isError } = useGetHistory(idString);

  return isLoading ? (
    <h1>fetching history...</h1>
  ) : isError || !history ? (
    <p>Error fetching History</p>
  ) : (
    <HistoryDescription history={history} />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<h1>Loading history...</h1>}>
      <HistoryContent />
    </Suspense>
  );
}
