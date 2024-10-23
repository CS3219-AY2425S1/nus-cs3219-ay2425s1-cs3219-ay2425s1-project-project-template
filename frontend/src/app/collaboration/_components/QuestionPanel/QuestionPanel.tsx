import { ClipboardList, SquareCheck } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import { ResizablePanel } from "@/components/ui/resizable";
import SolutionTabContent from "./SolutionTabContent";
import DescriptionTabContent from "./DescriptionTabContent";

export default function QuestionPanel() {
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

  return (
    <ResizablePanel className="p-1" defaultSize={50}>
      <TabPanel tabs={tabs} defaultValue="description" />
    </ResizablePanel>
  );
}
