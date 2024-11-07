import { Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';

import { CodeOutput } from '../../types/CodeExecutionType';
import OutputTab from './OutputTab';

interface CodeOutputTabsProps {
  codeOutput?: CodeOutput;
}

function CodeOutputTabs({ codeOutput }: CodeOutputTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTab && codeOutput) {
      setActiveTab('output');
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
        <Tabs.Tab value="output">Output</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="output" h="200px">
        <OutputTab codeOutput={codeOutput} />
      </Tabs.Panel>
    </Tabs>
  );
}

export default CodeOutputTabs;
