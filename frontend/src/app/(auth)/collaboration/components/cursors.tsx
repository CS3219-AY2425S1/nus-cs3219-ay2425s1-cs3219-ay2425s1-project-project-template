import { useEffect, useMemo, useState } from "react";
import { WebrtcProvider } from "y-webrtc";

type Props = {
    yProvider: WebrtcProvider;
    username: String;
};

type User = {
    name: string;
    color: string;
    cursor?: { lineNumber: number; column: number };
};

export function Cursors({ yProvider, username }: Props) {
    const [users, setUsers] = useState<Map<number, { user: User }>>(new Map());

    useEffect(() => {
        const awareness = yProvider.awareness;
        console.log("awareness", awareness);
        const clientId = yProvider.awareness.clientID

        function setLocalUser() {
            const localUser = {
                name: username,
                color: "#" + Math.floor(Math.random()*16777215).toString(16), // random color
                clientId
            };
            awareness.setLocalStateField("user", localUser);
        }

        setLocalUser();

        const updateUser = () => {
            const states = awareness.getStates();
            const usersMap = new Map<number, { user: User }>();

            states.forEach((state, clientId) => {
                if (state?.user) {
                    usersMap.set(clientId, { user: state.user });
                }
            });

            setUsers(usersMap);
        };

        awareness.on("change", updateUser);
        updateUser();

        return () => {
            awareness.off("change", updateUser);
        };
    }, [yProvider]);

    const styleSheet = useMemo(() => {
        let cursorStyles = "";

        users.forEach(({ user }, clientId) => {
            cursorStyles += `
                .yRemoteSelection-${clientId}::before {
                    content: "${user.name}";
                    color: ${user.color};
                    background-color: ${user.color}20;
                    padding: 2px 4px;
                    border-radius: 4px;
                    position: absolute;
                    top: -1.5em;
                    font-size: 12px;
                    transition: opacity 0.2s;
                }
                .yRemoteSelection-${clientId}:hover::before {
                    opacity: 1;
                }
                .yRemoteSelection-${clientId} {
                    background-color: ${user.color}40;
                    border-left: 2px solid ${user.color};
                }
            `;
        });

        return { __html: cursorStyles };
    }, [users]);

    return <style dangerouslySetInnerHTML={styleSheet} />;
}