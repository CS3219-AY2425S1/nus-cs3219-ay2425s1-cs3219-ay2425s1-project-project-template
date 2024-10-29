import { Card, CardBody, CardFooter } from "@nextui-org/card"; // Adjust imports as needed
import { Button } from "@nextui-org/react";
import React from "react";

interface ReconnectCardProps {
  onReconnect: () => void;
  onLeave: () => void;
}

const ReconnectCard: React.FC<ReconnectCardProps> = ({
  onReconnect,
  onLeave,
}) => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-[#6F0AD4] to-[#FE9977]">
      <CardBody>
        <h4 className="text-white font-medium text-large p-2">
          You're currently in a session
        </h4>
      </CardBody>
      <CardFooter className="flex justify-end gap-4 p-5">
        <Button
          onClick={onLeave}
          radius="lg"
          variant="flat"
          size="md"
          color="danger"
        >
          <span className="text-white">Leave</span>
        </Button>
        <Button
          onClick={onReconnect}
          radius="lg"
          variant="flat"
          size="md"
          color="success"
        >
          <span className="text-white">Reconnect</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReconnectCard;
