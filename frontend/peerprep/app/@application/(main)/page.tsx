"use client";

import { Button } from "@nextui-org/react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { useState } from "react";

import MatchUI from "@/components/matching/MatchUI";

export default function Home() {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(false);

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  return (
    <>
      <div>{isMatchUIVisible && <MatchUI onClose={handleClose} />}</div>
      <div className="flex flex-col items-center p-8">
        <p className="text-md text-left w-full font-semibold">My Activities</p>
        <div className="flex justify-center gap-8 w-full mt-4">
          <div className="w-3/4">
            <div className="flex gap-4">
              <Card className="flex-1 bg-gradient-to-br from-[#FE9977] to-[#6F0AD4]">
                <CardBody>
                  <p className="text-tiny text-black/40 uppercase font-bold">
                    Are you ready?
                  </p>
                  <h4 className="text-white font-medium text-large">
                    Start a new session
                  </h4>
                </CardBody>
                <CardFooter className="flex justify-end p-5">
                  <Button
                    onClick={() => setIsMatchUIVisible(true)}
                    radius="lg"
                    variant="flat"
                    size="md"
                    className=""
                  >
                    <span className="text-white">Start</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="w-1/4 hidden md:flex">
            <Card className="w-full">
              <CardBody>
                <h3 className="text-lg font-semibold mb-2 p-3 text-nowrap">
                  Friends
                </h3>
                <ul className="space-y-4 min-h-40" />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
