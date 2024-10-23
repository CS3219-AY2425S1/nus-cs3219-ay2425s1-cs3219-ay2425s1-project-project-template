import { Code } from "lucide-react";
import TabPanel, { Tab } from "@/app/collaboration/_components/TabPanel";
import { ResizablePanel } from "@/components/ui/resizable";
import CodeEditorTabContent from "./CodeEditorTabContent";

export function CollabCodePanel() {
  const tabs: Tab[] = [
    {
      value: "code",
      label: "Code",
      Icon: Code,
      content: <CodeEditorTabContent />,
    },
  ];

  return (
    <ResizablePanel className="p-1" defaultSize={70}>
      <TabPanel tabs={tabs} defaultValue={"code"} />
    </ResizablePanel>
  );
}
