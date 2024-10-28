import { Button, Group, Modal, Stack, Text } from '@mantine/core';

interface LeaveSessionModalProps {
  isLeaveSessionModalOpened: boolean;
  closeLeaveSessionModal: () => void;
  handleLeaveSession: () => void;
}

function LeaveSessionModal({
  isLeaveSessionModalOpened,
  closeLeaveSessionModal,
  handleLeaveSession,
}: LeaveSessionModalProps) {
  const handleLeaveButtonClick = () => {
    closeLeaveSessionModal();
    handleLeaveSession();
  };

  return (
    <Modal
      opened={isLeaveSessionModalOpened}
      onClose={closeLeaveSessionModal}
      withCloseButton={false}
      title="Hang on!"
      centered
      overlayProps={{
        blur: 4,
      }}
      styles={{ title: { fontWeight: 700 } }}
    >
      <Stack>
        <Text>Are you sure you want to leave this session?</Text>
        <Group justify="flex-end">
          <Button variant="light" color="red" onClick={handleLeaveButtonClick}>
            Leave
          </Button>
          <Button variant="light" color="gray" onClick={closeLeaveSessionModal}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default LeaveSessionModal;
