import { Tabs } from '@mantine/core';

import { TestCase } from '../../types/QuestionType';
import TestCasesTab from './TestCasesTab';

interface CodeOutputTabsProps {
  testCases?: TestCase[];
}

function CodeOutputTabs({ testCases }: CodeOutputTabsProps) {
  const showTestCases = testCases && testCases.length > 0;

  return (
    <Tabs
      bg="slate.9"
      p="10px"
      allowTabDeactivation
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
            Test Results
          </Tabs.Panel>
        </>
      )}
      <Tabs.Panel value="output" h="200px">
        Output
      </Tabs.Panel>
    </Tabs>
  );
}

export default CodeOutputTabs;
