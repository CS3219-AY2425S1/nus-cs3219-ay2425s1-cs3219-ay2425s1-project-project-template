import React from "react";
import { Badge } from "@nextui-org/badge"; // Import Badge component if it's in the same folder
import BoxIcon from "./boxicons";
import { Button } from "@nextui-org/button";

export const SettingButton: React.FC = () => {
  return (
    <Button
      className="text-gray-500 dark:text-gray-200"
      radius="full"
      isIconOnly
      variant="light"
    >
      <BoxIcon name="bxs-cog" />
    </Button>
  );
};

export const NotificationButton: React.FC = () => {
  return (
    <Badge shape="circle" color="danger">
      <Button
        radius="full"
        isIconOnly
        aria-label="more than 99 notifications"
        variant="light"
        className="text-red-500"
      >
        <BoxIcon name="bxs-bell" />
      </Button>
    </Badge>
  );
};
