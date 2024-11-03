import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, MessageSquareText } from "lucide-react";

interface ChatTopToolbarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatTopToolbar({ isCollapsed, setIsCollapsed }: ChatTopToolbarProps) {
    return (
    <CardHeader className="flex flex-col gap-4 h-fit">
      <div
        className={cn(
          "flex gap-4",
          isCollapsed
            ? "flex-col items-start justify-center"
            : "flex-row items-center justify-start"
        )}
      >
        <Button
          variant="soft"
          size="icon"
          onClick={() => {
            setIsCollapsed((prev) => !prev);
          }}
          className={cn("mr-2", "transition-all duration-300")}
        >
          {isCollapsed ? <MessageSquareText /> : <ArrowRightIcon />}
        </Button>
        {!isCollapsed && <div className="mr-auto font-semibold">Text Chat</div>}
        <Avatar className={cn(isCollapsed && "w-8 h-8")}>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </CardHeader>
  );
}
