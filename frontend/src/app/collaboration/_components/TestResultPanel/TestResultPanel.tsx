import { FlaskConical, Play } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import { ResizablePanel } from "@/components/ui/resizable";

export default function TestResultPanel() {
  const tabs: Tab[] = [
    {
      value: "test-cases",
      label: "Test cases",
      Icon: FlaskConical,
      content: (
        <>
          <h2>Test case</h2>
        </>
      ),
    },
    {
      value: "test-result",
      label: "Test result",
      Icon: Play,
      content: (
        <>
          <h2>Test Result</h2>
        </>
      ),
    },
  ];

  return (
    <ResizablePanel className="p-1" defaultSize={30}>
      <TabPanel tabs={tabs} defaultValue="test-cases" />
    </ResizablePanel>
  );
}
