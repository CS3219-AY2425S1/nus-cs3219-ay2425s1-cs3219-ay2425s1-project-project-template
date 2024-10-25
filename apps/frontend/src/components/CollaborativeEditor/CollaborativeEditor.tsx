// Referenced from example in https://www.npmjs.com/package/y-codemirror.next
import React, { useEffect, useRef } from "react";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import "./styles.scss";
import { message } from "antd";

interface CollaborativeEditorProps {
  user: string;
  collaborationId: string;
}

export const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

// Retrieve random colour
export const userColor =
  usercolors[Math.floor(Math.random() * (usercolors.length - 1))];

const CollaborativeEditor = (props: CollaborativeEditorProps) => {
  const editorRef = useRef(null);

  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const warning = (message: string) => {
    messageApi.open({
      type: "warning",
      content: message,
    });
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SIGNALLING_SERVICE_URL === undefined) {
      error("Missing Signalling Service Url");
      return;
    }

    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(props.collaborationId, ydoc, {
      signaling: [process.env.NEXT_PUBLIC_SIGNALLING_SERVICE_URL],
    });
    const ytext = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(ytext);

    provider.awareness.setLocalStateField("user", {
      name: props.user,
      color: userColor.color,
      colorLight: userColor.light,
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(ytext, provider.awareness, { undoManager }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current || undefined,
    });

    return () => {
      // Cleanup on component unmount
      view.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, []);

  return (
    <>
      {contextHolder}
      <div ref={editorRef} id="editor" className="code-editor-yjs" />
    </>
  );
};

export default CollaborativeEditor;
