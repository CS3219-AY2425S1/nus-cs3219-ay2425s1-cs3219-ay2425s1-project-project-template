import { ClipboardList, SquareCheck } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import SolutionTabContent from "./SolutionTabContent";
import DescriptionTabContent from "./DescriptionTabContent";

export default function QuestionTabPanel() {
  const tabs: Tab[] = [
    {
      value: "description",
      label: "Description",
      Icon: ClipboardList,
      content: <DescriptionTabContent />,
    },
    {
      value: "solution",
      label: "Solution",
      Icon: SquareCheck,
      content: <SolutionTabContent />,
    },
  ];

  return <TabPanel tabs={tabs} defaultValue="description" />;
}
