import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import CollabCodePanel from "@/app/collaboration/_components/CollabCodePanel";
import TestResultPanel from "@/app/collaboration/_components/TestResultPanel";
import QuestionPanel from "@/app/collaboration/_components/QuestionPanel";

export default function Page() {
  return (
    <ResizablePanelGroup className="flex-1 mx-auto" direction="horizontal">
      <QuestionPanel />
      <ResizableHandle withHandle={true} />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction={"vertical"}>
          <CollabCodePanel />
          <ResizableHandle withHandle={true} />
          <TestResultPanel />
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
