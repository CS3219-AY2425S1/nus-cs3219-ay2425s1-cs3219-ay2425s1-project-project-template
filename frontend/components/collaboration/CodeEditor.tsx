"use client";

import ReactQuill from "react-quill";
import { QuillBinding } from "y-quill";
import * as Y from "yjs";
import { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import 'react-quill/dist/quill.snow.css';

export function CollaborativeEditor() {
  const [text, setText] = useState<Y.Text>();
  const [provider, setProvider] = useState<WebrtcProvider>();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("quill");
    const yProvider = new WebrtcProvider("quill-temp", yDoc);

    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, []);

  if (!text || !provider) {
    return null;
  }

  return <QuillEditor provider={provider} yText={text} />;
}

type EditorProps = {
  yText: Y.Text;
  provider: any;
};

function QuillEditor({ yText, provider }: EditorProps) {
  const reactQuillRef = useRef<ReactQuill>(null);

  // Set up Yjs and Quill
  useEffect(() => {
    let quill: ReturnType<ReactQuill["getEditor"]>;
    let binding: QuillBinding;

    if (!reactQuillRef.current) {
      return;
    }

    quill = reactQuillRef.current.getEditor();
    binding = new QuillBinding(yText, quill, provider.awareness);

    return () => {
      binding?.destroy?.();
    };
  }, [yText, provider]);

  return (
    <ReactQuill
      ref={reactQuillRef}
      modules={{
        toolbar: false,
        history: {
          // Local undo shouldn't undo changes from remote users
          userOnly: true,
        },
      }}
      placeholder="Start typing here…"
      theme="snow"
    />
  );
}
