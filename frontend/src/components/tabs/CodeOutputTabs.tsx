import { Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';

import { CodeOutput, TestResult } from '../../types/CodeExecutionType';
import { TestCase } from '../../types/QuestionType';
import OutputTab from './OutputTab';
import TestCasesTab from './TestCasesTab';
import TestResultsTab from './TestResultsTab';

interface CodeOutputTabsProps {
  codeOutput?: CodeOutput;
  testCases?: TestCase[];
  testResults?: TestResult[];
}

function CodeOutputTabs({
  codeOutput,
  testCases,
  testResults,
}: CodeOutputTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const showTestCases = testCases && testCases.length > 0;

  useEffect(() => {
    if (activeTab) {
      return;
    }
    if (testResults) {
      setActiveTab('testResults');
      return;
    }
    if (codeOutput) {
      setActiveTab('output');
    }
  }, [codeOutput, testResults]);

  return (
    <Tabs
      bg="slate.9"
      p="10px"
      allowTabDeactivation
      value={activeTab}
      onChange={setActiveTab}
      style={{ borderRadius: '4px' }}
    >
      <Tabs.List>
        {showTestCases && (
          <>
            <Tabs.Tab value="testCases">Test Cases</Tabs.Tab>
            <Tabs.Tab value="testResults">Test Results</Tabs.Tab>
          </>
        )}
        <Tabs.Tab value="output">Output</Tabs.Tab>
      </Tabs.List>

      {showTestCases && (
        <>
          <Tabs.Panel value="testCases" h="200px">
            <TestCasesTab testCases={testCases} />
          </Tabs.Panel>
          <Tabs.Panel value="testResults" h="200px">
            <TestResultsTab testResults={testResults} />
          </Tabs.Panel>
        </>
      )}
      <Tabs.Panel value="output" h="200px">
        <OutputTab codeOutput={codeOutput} />
      </Tabs.Panel>
    </Tabs>
  );
}

export default CodeOutputTabs;
