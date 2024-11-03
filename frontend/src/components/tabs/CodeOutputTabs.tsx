import { Tabs } from '@mantine/core';

import TestCasesTab from './TestCasesTab';

interface CodeOutputTabsProps {}

function CodeOutputTabs({}: CodeOutputTabsProps) {
  return (
    <Tabs
      bg="slate.9"
      p="10px"
      allowTabDeactivation
      style={{ borderRadius: '4px' }}
    >
      <Tabs.List>
        <Tabs.Tab value="testCases">Test Cases</Tabs.Tab>
        <Tabs.Tab value="testResults">Test Results</Tabs.Tab>
        <Tabs.Tab value="output">Output</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="testCases" h="200px">
        <TestCasesTab />
      </Tabs.Panel>
      <Tabs.Panel value="testResults" h="200px">
        Test Results
      </Tabs.Panel>
      <Tabs.Panel value="output" h="200px">
        Output
      </Tabs.Panel>
    </Tabs>
  );
}

export default CodeOutputTabs;
