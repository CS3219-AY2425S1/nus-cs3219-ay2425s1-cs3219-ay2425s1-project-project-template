// Referenced from example in https://www.npmjs.com/package/y-codemirror.next
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { python, pythonLanguage } from "@codemirror/lang-python";
import { javaLanguage, java } from "@codemirror/lang-java";
import { cppLanguage, cpp } from "@codemirror/lang-cpp";
import { goLanguage, go } from "@codemirror/lang-go";
import "./styles.scss";
import { message, Select } from "antd";
import { language } from "@codemirror/language";
import { ProgrammingLanguageOptions } from "@/utils/SelectOptions";

interface CollaborativeEditorProps {
  user: string;
  collaborationId: string;
  language: string;
  setMatchedUser: Dispatch<SetStateAction<string>>;
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
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [trigger, setTrigger] = useState(false);

  const languageConf = new Compartment();

  // Referenced: https://codemirror.net/examples/config/#dynamic-configuration
  const autoLanguage = EditorState.transactionExtender.of((tr) => {
    if (!tr.docChanged) return null;

    const snippet = tr.newDoc.sliceString(0, 100);
    // Test for various language
    const docIsPython = /^\s*(def|class)\s/.test(snippet);
    const docIsJava = /^\s*(class|public\s+static\s+void\s+main)\s/.test(
      snippet
    ); // Java has some problems
    const docIsCpp = /^\s*(#include|namespace|int\s+main)\s/.test(snippet); // Yet to test c++
    const docIsGo = /^(package|import|func|type|var|const)\s/.test(snippet);

    let newLanguage;
    let languageType;
    let languageLabel;

    if (docIsPython) {
      newLanguage = python();
      languageLabel = "Python";
      languageType = pythonLanguage;
    } else if (docIsJava) {
      newLanguage = java();
      languageLabel = "Java";
      languageType = javaLanguage;
    } else if (docIsGo) {
      newLanguage = go();
      languageLabel = "Go";
      languageType = goLanguage;
    } else if (docIsCpp) {
      newLanguage = cpp();
      languageLabel = "C++";
      languageType = cppLanguage;
    } else {
      newLanguage = javascript(); // Default to JavaScript
      languageLabel = "JavaScript";
      languageType = javascriptLanguage;
    }

    const stateLanguage = tr.startState.facet(language);
    if (languageType == stateLanguage) return null;

    setSelectedLanguage(languageLabel);

    return {
      effects: languageConf.reconfigure(newLanguage),
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
      maxConns: 2,
    });
    const ytext = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(ytext);

    provider.awareness.setLocalStateField("user", {
      name: props.user,
      color: userColor.color,
      colorLight: userColor.light,
    });

    // Check initial awareness states
    const states = provider.awareness.getStates();
    for (const [clientID, state] of Array.from(states)) {
      if (state.user && state.user.name !== props.user) {
        props.setMatchedUser(state.user.name);
        break;
      }
    }

    // Listen for awareness changes
    provider.awareness.on("change", () => {
      const updatedStates = provider.awareness.getStates();
      for (const [clientID, state] of Array.from(updatedStates)) {
        if (state.user && state.user.name !== props.user) {
          props.setMatchedUser(state.user.name);
          break;
        }
      }
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
          disabled
        />
      </div>
      <div
        ref={editorRef}
        style={{ height: "400px", border: "1px solid #ddd" }}
      />
      <div className="language-detected">
        <strong>Current Language Detected: </strong> {selectedLanguage}
      </div>
    </>
  );
};

export default CollaborativeEditor;
