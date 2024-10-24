"use client";

import { useEffect, useMemo, useState } from "react";
import { WebsocketProvider } from "y-websocket";

interface AwarenessUser {
  name: string;
  color: string;
}

type AwarenessList = [number, AwarenessUser][];

interface InjectableCursorStylesProps {
  yProvider: WebsocketProvider;
  cursorName: string;
  cursorColor: string;
}

export default function InjectableCursorStyles({
  yProvider,
  cursorName,
  cursorColor,
}: InjectableCursorStylesProps) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([]);

  // Set up current user's presence and also update whenever remote client submits its own presence
  useEffect(() => {
    const awareness = yProvider.awareness;

    // TODO: make this dynamic with the context api and choose random hex colors
    awareness.setLocalStateField("user", {
      name: cursorName,
      color: cursorColor,
      // color: "#0096C7",
    });

    const updateAwarenessUsers = () => {
      const states = awareness.getStates(); // Get all user states
      const users: AwarenessList = [];
      states.forEach((val, key) => {
        users.push([key, val.user]);
      });

      setAwarenessUsers(users);
    };

    // Attach change event listener
    awareness.on("change", updateAwarenessUsers);
    updateAwarenessUsers();

    return () => {
      awareness.off("change", updateAwarenessUsers);
    };
  }, [yProvider]);

  const styleSheet = useMemo(() => {
    let cursorStyles = "";

    awarenessUsers.forEach((client) => {
      console.log(client, client[0], client[1]);
      cursorStyles += `
          .yRemoteSelection-${client[0]},
          .yRemoteSelectionHead-${client[0]}  {
            --user-color: ${client[1].color};
          }

          .yRemoteSelectionHead-${client[0]}::after {
            content: "${client[1].name}";
          }
        `;
    });

    return { __html: cursorStyles };
  }, [awarenessUsers]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}
