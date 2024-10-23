/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as Y from "yjs";
import { useEffect, useMemo, useState } from "react";
import diff from "fast-diff";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";

const doc = new Y.Doc();
const ytext = doc.getText();

/** A hook to read and set a YText value. */
function useText(
  ytext: Y.Text,
  socket: any
): [string, (text: string) => void, (delta: any) => void] {
  const [text, setText] = useState(ytext.toString());
  ytext.observe(() => {
    setText(ytext.toString());
  });
  const setYText = (textNew: string) => {
    const delta = diffToDelta(diff(text, textNew));
    if (socket.connected) {
      console.log("emitting delta", delta);
      socket.emit("any", delta);
      ytext.applyDelta(delta);
    } else {
      console.log("socket not connected");
    }
  };
  const apply = (delta: any) => {
    ytext.applyDelta(delta);
  };
  return [text, setYText, apply];
}

/** Convert a fast-diff result to a YJS delta. */
function diffToDelta(diffResult: [any, any][]) {
  return diffResult.map(([op, value]) =>
    op === diff.INSERT
      ? { insert: value }
      : op === diff.EQUAL
      ? { retain: value.length }
      : op === diff.DELETE
      ? { delete: value.length }
      : null
  );
}

export default function YTester2({ userId }: { userId: string }) {
  const socket = useMemo(() => {
    return io("ws://localhost:1234", {
      autoConnect: false,
      reconnection: false,
    });
  }, []);

  const [text, setText, applyUpdate] = useText(ytext, socket);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("connected");
    });

    // Listen for delta events and apply them to Y.Text
    socket.on("any", (delta: any) => {
      console.log("Received delta", delta);
      applyUpdate(delta);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("disconnected");
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="flex flex-col w-full h-screen">
      <h1>
        User Id {userId} connected: {isConnected ? "true" : "false"}
      </h1>
      <textarea
        className="h-64 bg-background text-primary"
        value={text}
        onInput={(e) => {
          setText(e.currentTarget.value);
        }}
      />
      <p>Text: {text}</p>
      <div className="flex flex-row gap-4">
        <Button onClick={() => socket.connect()}>Connect</Button>
      </div>
    </div>
  );
}
