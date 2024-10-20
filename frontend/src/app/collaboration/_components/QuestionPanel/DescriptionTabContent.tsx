import { ClipboardList, Square, SquareCheck } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import { ResizablePanel } from "@/components/ui/resizable";

export default function QuestionPanel() {
  const tabs: Tab[] = [
    {
      value: "description",
      label: "Description",
      Icon: ClipboardList,
      content: (
        <>
          <h2>Coin Change</h2>
          <p>Test problem</p>
        </>
      ),
    },
    {
      value: "solution",
      label: "Solution",
      Icon: SquareCheck,
      content: (
        <>
          <h2>Solution</h2>
          <p>Here is how you solve the problem....</p>
        </>
      ),
    },
  ];

  return (
    <ResizablePanel className="px-2" defaultSize={50}>
      <TabPanel tabs={tabs} defaultValue={"description"} />
    </ResizablePanel>
  );
}
