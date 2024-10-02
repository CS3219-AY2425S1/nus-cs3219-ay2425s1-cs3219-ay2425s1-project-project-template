import React from "react";
import { Badge } from "@nextui-org/badge"; // Import Badge component if it's in the same folder
import { Button } from "@nextui-org/button";

import BoxIcon from "./boxicons";

export const SettingButton: React.FC = () => {
  return (
    <Button
      isIconOnly
      className="text-gray-500 dark:text-gray-200"
      radius="full"
      variant="light"
    >
      <BoxIcon name="bxs-cog" />
    </Button>
  );
};

export const NotificationButton: React.FC = () => {
  return (
    <Badge color="danger" shape="circle">
      <Button isIconOnly className="text-red-500" radius="full" variant="light">
        <BoxIcon name="bxs-bell" />
      </Button>
    </Badge>
  );
};
