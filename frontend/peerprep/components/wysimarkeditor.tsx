import { Textarea } from "@nextui-org/react";
import { Editable, useEditor } from "@wysimark/react";
import { useEffect, useState } from "react";

interface WysiMarkEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const WysiMarkEditor = ({
  initialValue,
  onChange,
}: WysiMarkEditorProps) => {
  const [markdown, setMarkdown] = useState("");

  const editor = useEditor({
    authToken: process.env.imageUploadKey,
    minHeight: 500,
  });

  const handleEditorChange = (value: string) => {
    setMarkdown(value); // Update local state
    onChange(value);
  };

  useEffect(() => {
    setMarkdown(initialValue);
  }, [initialValue]);

  return (
    <div className="flex flex-row gap-2 w-fit bg-gray-100 dark:bg-zinc-900 rounded">
      <Editable
        editor={editor}
        value={markdown}
        onChange={handleEditorChange}
        className="w-[1000px] text-left bg-gray-100 fill-gray-800 dark:text-gray-400 dark:bg-zinc-900"
      />
    </div>
  );
};
