import { createContext, ReactNode, useState } from "react";

export interface RoomContextInterface {
    users: Array<string>
    roomId: string,
    setUserMatch: Function,
    resetMatchData: Function
}

const defaultState = {
    users: ["", ""],
    roomId: "",
    setUserMatch: (user1: string, user2: string) => { },
    resetMatchData: () => { }
} as RoomContextInterface

type ContextProviderNode = {
    children: ReactNode
};

export const RoomContext = createContext(defaultState)



export default function RoomContextProvider({children} : ContextProviderNode) {
    const [users, setUsers] = useState<Array<string>>(defaultState.users);
    const [roomId, setRoomId] = useState<string>("");

    const setUserMatch = (user1: string, user2: string) => {
        const sortedNames = [user1, user2].sort();
        const user1Encode = `${sortedNames[0].length}#${sortedNames[0]}`;
        const user2Encode = `${sortedNames[1].length}#${sortedNames[1]}`;
        const encodedRoomId = user1Encode + user2Encode;

        setUsers(sortedNames);
        setRoomId(encodedRoomId);
    }

    const resetMatchData = () => {
        setUsers(["", ""]);
        setRoomId("");
    }

    return (
        <RoomContext.Provider value={{users, roomId, setUserMatch, resetMatchData}}>
            {children}
        </RoomContext.Provider>
    )
}

