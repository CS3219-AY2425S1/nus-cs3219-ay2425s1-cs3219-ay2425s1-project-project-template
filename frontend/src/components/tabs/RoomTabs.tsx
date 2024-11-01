import { Tabs } from '@mantine/core';

import DescriptionTab from './DescriptionTab';
import ChatBoxTab from './ChatBoxTab';

interface RoomTabsProps {
  questionId: string;
  sessionId: string;
  token: string;
}

function RoomTabs({ questionId, sessionId, token }: RoomTabsProps) {
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
        <Tabs.Tab value="chat">Chat</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description" h="calc(100% - 36px)">
        <DescriptionTab
          questionId={questionId}
        />
      </Tabs.Panel>
      <Tabs.Panel value="chat" h="calc(100% - 36px)">
        <ChatBoxTab
          roomId={sessionId}
          token={token}
        />
      </Tabs.Panel>
    </Tabs>
  );
}

export default RoomTabs;
