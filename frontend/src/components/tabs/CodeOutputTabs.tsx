import { Indicator, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
  isRunningCode: boolean;
}

function CodeOutputTabs({
  codeOutput,
  testCases,
  testResults,
  isRunningCode,
}: CodeOutputTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [
    isTestResultsIndicatorShowed,
    { open: showTestResultsIndicator, close: hideTestResultsIndicator },
  ] = useDisclosure(false);
  const [
    isOutputIndicatorShowed,
    { open: showOutputIndicator, close: hideOutputIndicator },
  ] = useDisclosure(false);

  const showTestCases = testCases && testCases.length > 0;

  useEffect(() => {
    switch (activeTab) {
      case 'testResults':
        hideTestResultsIndicator();
        break;
      case 'output':
        hideOutputIndicator();
        break;
      default:
        break;
    }
  }, [activeTab]);

  useEffect(() => {
    if (testResults && activeTab !== 'testResults') {
      showTestResultsIndicator();
    }
  }, [testResults]);

  useEffect(() => {
    if (codeOutput && activeTab !== 'output') {
      showOutputIndicator();
    }
  }, [codeOutput]);

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
            <Indicator
              disabled={!isTestResultsIndicatorShowed}
              processing={isRunningCode}
            >
              <Tabs.Tab value="testResults">Test Results</Tabs.Tab>
            </Indicator>
          </>
        )}
        <Indicator
          disabled={!isOutputIndicatorShowed}
          processing={isRunningCode}
        >
          <Tabs.Tab value="output">Output</Tabs.Tab>
        </Indicator>
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
