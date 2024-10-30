// import { createContext, MutableRefObject, ReactNode, useRef, useState } from "react";

// export interface RoomContextInterface {
//     users: Array<string>
//     roomIdRef: MutableRefObject<string>,
//     setUserMatch: Function,
//     resetMatchData: Function
// }

// const defaultState = {
//     users: ["", ""],
//     roomIdRef: useRef<string>(""),
//     setUserMatch: (user1: string, user2: string) => { },
//     resetMatchData: () => { }
// } as RoomContextInterface

// type ContextProviderNode = {
//     children: ReactNode
// };

// export const RoomContext = createContext(defaultState)



// export default function RoomContextProvider({children} : ContextProviderNode) {
//     const [users, setUsers] = useState<Array<string>>(defaultState.users);
//     const roomIdRef = useRef<string>("");

//     const setUserMatch = (user1: string, user2: string) => {
//         const sortedNames = [user1, user2].sort();
//         const user1Encode = `${sortedNames[0].length}$${sortedNames[0]}`;
//         const user2Encode = `${sortedNames[1].length}$${sortedNames[1]}`;
//         const encodedRoomId = user1Encode + user2Encode;
//         setUsers(sortedNames);
//         roomIdRef.current = encodedRoomId;
//     }

//     const resetMatchData = () => {
//         setUsers(["", ""]);
//         roomIdRef.current = "";
//     }

//     return (
//         <RoomContext.Provider value={{users, roomIdRef!.current, setUserMatch, resetMatchData}}>
//             {children}
//         </RoomContext.Provider>
//     )
// }

export default function roomContext() {
    return null;
}

