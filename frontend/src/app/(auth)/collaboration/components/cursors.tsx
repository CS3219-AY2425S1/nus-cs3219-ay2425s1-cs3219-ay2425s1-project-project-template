import { useEffect, useMemo, useState } from "react";
import { WebrtcProvider } from "y-webrtc";

type Props = {
    yProvider: WebrtcProvider;
    username: String;
    cursorPosition: object;
};

type CursorPosition = {
    startLineNumber: number;
    endLineNumber: number;
};

type User = {
    name: string;
    color: string;
    cursor: CursorPosition;
};

export function Cursors({ yProvider, username, cursorPosition }: Props) {
    const [users, setUsers] = useState<Map<number, { user: User }>>(new Map());

    useEffect(() => {
        const awareness = yProvider.awareness;
        const clientId = yProvider.awareness.clientID;
    
        function setLocalUser() {
            const generateRandomColor = () => {
                let color;
                do {
                    color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                } while (color === "#000000" || color === "#1e1e1e");
                return color;
            };
    
            const localUser = {
                name: username,
                color: generateRandomColor(),
                clientId,
                cursor: cursorPosition,
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
    }, [yProvider, cursorPosition, username]);   

    const styleSheet = useMemo(() => {
        let cursorStyles = "";

        users.forEach(({ user }, clientId) => {
            const { startLineNumber, endLineNumber } = user.cursor;
            if (startLineNumber === endLineNumber) {
            cursorStyles += `
                .yRemoteSelection-${clientId}::before {
                content: "${user.name}";
                color: ${user.color};
                background-color: ${user.color}20;
                padding-left: 2px;
                padding-right: 2px;
                border-radius: 2px;
                position: absolute;
                top: -1.5em;
                font-size: 10px;
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
            } else {
            cursorStyles += `
                .yRemoteSelection-${clientId}::after {
                color: ${user.color};
                background-color: ${user.color}20;
                padding-left: 2px;
                padding-right: 2px;
                border-radius: 2px;
                position: absolute;
                top: ${(endLineNumber - startLineNumber + 1) * 20}px;
                font-size: 10px;
                transition: opacity 0.2s;
                }
                .yRemoteSelection-${clientId}:hover::after {
                opacity: 1;
                }
                .yRemoteSelection-${clientId} {
                background-color: ${user.color}40;
                border-left: 2px solid ${user.color};
                }
            `;
            }
        });

        return { __html: cursorStyles };
    }, [users]);

    return <style dangerouslySetInnerHTML={styleSheet} />;
}