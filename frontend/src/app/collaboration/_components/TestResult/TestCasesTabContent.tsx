import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question, TestCase } from "@/types/Question";

interface TestCasesTabContentProps {
  question: Question;
}

export default function TestCasesTabContent({
  question,
}: TestCasesTabContentProps) {
  return (
    <Tabs defaultValue={`test-case-0`} className="w-full h-full pt-2">
      <TabsList className="flex flex-row justify-start gap-2 bg-transparent rounded-t-none">
        {/* Dynamic test cases */}
        {question.testCases.map((_, index: number) => (
          <TabsTrigger value={`test-case-${index}`} key={index}>
            Test case {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* Dynamic test case content */}
      {question.testCases.map((testCase: TestCase, index: number) => (
        <TabsContent value={`test-case-${index}`} key={index}>
          <div className="flex flex-row gap-8 p-4">
            <label>
              <p>Input</p>
              <p className="px-2 py-1 rounded-md bg-background-100">
                {testCase.input}
              </p>
            </label>
            <label>
              <p>Expected output</p>
              <p className="px-2 py-1 rounded-md bg-background-100">
                {testCase.expectedOutput}
              </p>
            </label>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
