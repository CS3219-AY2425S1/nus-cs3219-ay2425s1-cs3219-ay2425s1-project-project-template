import { Tabs } from '@mantine/core';

import { Question } from '../../types/QuestionType';
import DescriptionTab from './DescriptionTab';

interface RoomTabsProps {
  question?: Question;
}

function RoomTabs({ question }: RoomTabsProps) {
  return (
    <Tabs
      defaultValue="description"
      h="calc(100% - 160px)"
      bg="slate.9"
      p="10px"
      style={{ borderRadius: '4px' }}
    >
      <Tabs.List>
        <Tabs.Tab value="description">Description</Tabs.Tab>
        {/* <Tabs.Tab value="notes">Notes</Tabs.Tab>
        <Tabs.Tab value="output">Output</Tabs.Tab> */}
      </Tabs.List>

      <Tabs.Panel value="description" h="calc(100% - 36px)">
        <DescriptionTab question={question} />
      </Tabs.Panel>
      {/* <Tabs.Panel value="notes" h="calc(100% - 36px)">
        <Container p="16px">Notes</Container>
      </Tabs.Panel>
      <Tabs.Panel value="output" h="calc(100% - 36px)">
        <Container p="16px">Output</Container>
      </Tabs.Panel> */}
    </Tabs>
  );
}

export default RoomTabs;
