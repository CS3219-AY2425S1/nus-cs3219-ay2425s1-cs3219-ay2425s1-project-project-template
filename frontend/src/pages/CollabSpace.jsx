import * as React from "react";
import CodeEditor from "../components/CodeEditor";
import { useParams } from "react-router-dom";

const CollabSpace = () => {
    const { roomId } = useParams();

    return (
        <>
            <h1>Room ID: {roomId}</h1>
            <CodeEditor roomId={roomId}></CodeEditor>
        </>
    );
};

export default CollabSpace;
