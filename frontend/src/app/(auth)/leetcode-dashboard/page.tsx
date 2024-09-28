import { LeetcodeDashboardTable } from "@/app/(auth)/leetcode-dashboard/LeetcodeDashboardTable";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import { PlusIcon } from "lucide-react";

const LeetcodeDashboardHeader = () => {
  return (
    <div className="flex flex-col mt-8">
      <span className="text-h3 font-medium text-white">
        Leetcode Admin Dashboard
      </span>
      <div className="flex flex-col text-white text-lg font-light">
        <span>
          For Admin users only: Interact with PeerPrep&apos;s Leetcode database!
        </span>
      </div>
    </div>
  );
};

const LeetcodeDashboard = () => {
  return (
    <Container>
      <LeetcodeDashboardHeader />
      <div className="flex justify-end mb-4">
        <Button>
          <PlusIcon /> Add A Question
        </Button>
      </div>
      <LeetcodeDashboardTable />
    </Container>
  );
};

export default LeetcodeDashboard;
