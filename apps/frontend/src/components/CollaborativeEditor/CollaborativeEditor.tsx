// Referenced from example in https://www.npmjs.com/package/y-codemirror.next
import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python, pythonLanguage } from "@codemirror/lang-python";
import "./styles.scss";
import { message, Select } from "antd";
import { language } from "@codemirror/language";
import { ProgrammingLanguageOptions } from "@/utils/SelectOptions";

interface CollaborativeEditorProps {
  user: string;
  collaborationId: string;
  language: string;
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
  // const viewRef = useRef<EditorView | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [trigger, setTrigger] = useState(false);

  const languageConf = new Compartment();

  const autoLanguage = EditorState.transactionExtender.of((tr) => {
    if (!tr.docChanged) return null;
    const docIsPython = /^\s*def\s|\s*class\s/.test(
      tr.newDoc.sliceString(0, 100)
    );
    const stateIsPython = tr.startState.facet(language) === pythonLanguage;
    if (docIsPython === stateIsPython) return null;

    const newLanguage = docIsPython ? "python" : "javascript";
    setSelectedLanguage(newLanguage);

    return {
      effects: languageConf.reconfigure(
        newLanguage === "python" ? python() : javascript()
      ),
    };
  });

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

  // const handleLanguageChange = (val: any) => {
  //   console.log("came in here");
  //   console.log(val);
  //   setSelectedLanguage(val);

  //   let languageExtension;
  //   switch (val) {
  //     case "python":
  //       languageExtension = python();
  //       break;
  //     default:
  //       languageExtension = javascript();
  //   }

  //   // Update the language configuration
  //   if (viewRef.current) {
  //     console.log("insude here");
  //     viewRef.current.dispatch({
  //       effects: languageConf.reconfigure(languageExtension),
  //     });
  //   }
  // };

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
        languageConf.of(javascript()),
        autoLanguage,
        yCollab(ytext, provider.awareness, { undoManager }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current || undefined,
    });

    // viewRef.current = new EditorView({
    //   state: state,
    //   parent: editorRef.current || undefined,
    // });

    return () => {
      // Cleanup on component unmount
      console.log("unmounting collaboration editor"); // TODO: remove
      view.destroy();
      // viewRef.current?.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, []);

  return (
    <>
      {contextHolder}
      <div className="code-second-container">
        <div className="code-language">Select Language:</div>
        <Select
          className="language-select"
          defaultValue={selectedLanguage}
          options={ProgrammingLanguageOptions}
          onSelect={(val) => setSelectedLanguage(val)}
        />
      </div>
      <div
        ref={editorRef}
        style={{ height: "400px", border: "1px solid #ddd" }}
      />
      <div className="language-detected">
        <strong>Current Language Detected: </strong>{" "}
        {
          ProgrammingLanguageOptions.find(
            (language) => language.value === selectedLanguage
          )?.label
        }
      </div>
    </>
  );
};

export default CollaborativeEditor;
