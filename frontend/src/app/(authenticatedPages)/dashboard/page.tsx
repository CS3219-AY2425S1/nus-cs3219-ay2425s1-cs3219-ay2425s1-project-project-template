"use client";

import { getUserInterviewMetadata } from "@/api/dashboard";
import DashboardCard from "@/app/(authenticatedPages)/dashboard/components/DashboardCard";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { DataTableDemo } from "@/components/ui/DataTable";
import { UserInterviewMetadata } from "@/types/dashboard";
import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";

const Dashboard = () => {
  const [userInterviewMetadata, setUserInterviewMetadata] =
    useState<UserInterviewMetadata>();

  useEffect(() => {
    setUserInterviewMetadata(getUserInterviewMetadata());
  }, []);

  const dateFormattingOption: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return (
    <Container className="flex flex-col w-full">
      <div className="flex flex-row w-full gap-8">
        <DashboardCard
          cardTitleLabel="Completed This Week"
          cardBodyLabel={`${userInterviewMetadata?.completedThisWeek.interviewCount} Interviews`}
          cardFooterLabel={`${userInterviewMetadata?.completedThisWeek.dateRangeStart.toLocaleDateString(
            "en-US",
            dateFormattingOption
          )} - ${userInterviewMetadata?.completedThisWeek.dateRangeEnd.toLocaleDateString(
            "en-US",
            dateFormattingOption
          )}`}
        />
        <DashboardCard
          cardTitleLabel="Latest Interview With"
          cardBodyLabel={`${userInterviewMetadata?.latestInterview.latestInterviewPartnerName}`}
          cardFooterLabel={`You collaborated for ${userInterviewMetadata?.latestInterview.timeTakenFormatted}`}
        />
        <Button className="w-full self-end flex gap-3" size={"lg"}>
          <IoMdSearch />
          <span>Find Interview Peer</span>
        </Button>
      </div>
      <DataTableDemo />
    </Container>
  );
};

export default Dashboard;
