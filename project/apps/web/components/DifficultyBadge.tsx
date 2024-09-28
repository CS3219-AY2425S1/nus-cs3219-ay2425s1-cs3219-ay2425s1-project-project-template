import { Badge } from "@/components/ui/badge";
import { Complexity } from "@repo/dtos/questions";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  complexity: Complexity;
  className?: string;
}

const DifficultyBadge = ({ complexity, className }: DifficultyBadgeProps) => {
  let colorClass = "";

  switch (complexity) {
    case Complexity.Easy:
      colorClass = "bg-green-400 text-white hover:bg-green-400";
      break;
    case Complexity.Medium:
      colorClass = "bg-yellow-400 text-white hover:bg-yellow-400";
      break;
    case Complexity.Hard:
      colorClass = "bg-red-400 text-white hover:bg-red-400";
      break;
    default:
      colorClass = "bg-secondary text-white";
  }

  return (
    <Badge style={{ userSelect: "none" }} className={cn(className, colorClass)}>
      {complexity}
    </Badge>
  );
};

export default DifficultyBadge;
