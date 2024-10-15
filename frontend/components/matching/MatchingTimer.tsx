import { useEffect, useState, useRef } from "react";
import { Progress } from "@nextui-org/progress";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";

interface MatchingTimerProps {
  seconds: number;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
};
const MATCHING_TIMER_CARD_STYLES =
  "w-9/12 gap-y-7 flex mx-auto flex-col justify-center p-20";

export default function MatchingTimer({ seconds }: MatchingTimerProps) {
  // set the remaining Time for a minute
  const [timeRemaining, setTimeRemaining] = useState<number>(seconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  const setActive = () => {
    setIsActive(true);
  };
  const setInActive = () => {
    setIsActive(false);
  };

  useEffect(() => {
    if ((!isActive || timeRemaining < 1) && timerRef.current) {
      setIsActive(false);
      clearInterval(timerRef.current);
      timerRef.current = null;

      return;
    }
    if (timeRemaining < 1) {
      setIsActive(false);

      return;
    }
    if (isActive && timeRemaining > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeRemaining, isActive]);

  return (
    <Card className={MATCHING_TIMER_CARD_STYLES} shadow="md">
      <h2
        className={`text-4xl mb-20 capitalize ${isActive ? "animate-pulse" : ""}`}
      >
        {isActive ? "Finding a match..." : "Start to find match"}
      </h2>
      <h2>
        Why don&apos;t programmers tell secrets in a forest? Because the trees
        may leave &quot;logs&quot;!
      </h2>
      <Progress
        aria-label="Working Hard to find you a match"
        color="secondary"
        radius="md"
        size="lg"
        value={((seconds - timeRemaining) / seconds) * 100}
      />
      <div className="flex justify-between">
        <h2>{`${formatTime(timeRemaining)} / ${formatTime(seconds)}`}</h2>
        <Button
          color="danger"
          variant="ghost"
          onPress={isActive ? setInActive : setActive}
        >
          {isActive ? "Cancel" : "Start"}
        </Button>
      </div>
    </Card>
  );
}
