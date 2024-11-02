"use client";

import { useState } from "react";

import { useHistory } from "@/hooks/api/history";
import HistoryTable from "@/components/history/HistoryTable";

export default function Page() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { data: historyList, isLoading, isError } = useHistory(pageNumber);
  const handleOnPageClick = (page: number) => {
    setPageNumber(page);
  };

  return (
    <>
      {isLoading ? (
        <p>Fetching History...</p>
      ) : isError ? (
        <p>Had Trouble Fetching History!</p>
      ) : (
        <div className="flex justify-center">
          <HistoryTable
            handlePageOnClick={handleOnPageClick}
            isAdmin={false}
            pageNumber={pageNumber}
            historys={historyList?.records || []}
            totalPages={parseInt(historyList?.totalPages || "1")}
          />
        </div>
      )}
    </>
  );
}
