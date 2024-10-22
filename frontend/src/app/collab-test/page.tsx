"use client";

import { Button } from "@/components/ui/button";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { z } from "zod";

const OperationSchema = z.object({
  inputType: z.string(),
  data: z.string().nullable(),
  selectionStart: z.number(),
  selectionEnd: z.number(),
});

type Operation = z.infer<typeof OperationSchema>;

export default function Page() {
  const ref = useRef<HTMLTextAreaElement>(null);

  const [code, setCode] = useState("");
  const [anotherCode, setAnotherCode] = useState("");

  // Operation captured from the input event
  const [operation, setOperation] = useState<Operation | null>(null);

  const selections = useRef({
    selectionStart: 0,
    selectionEnd: 0,
  });

  // Whether the code matches the anotherCode
  const match: boolean = useMemo(() => {
    return code === anotherCode;
  }, [code, anotherCode]);

  // Apply the operation when it is received from the server
  const applyOperation = (
    operation: Operation,
    setStateAction: Dispatch<SetStateAction<string>>
  ) => {
    const { inputType, data, selectionStart, selectionEnd } = operation;

    // Apply the operation to current code
    setStateAction((prevCode: string) => {
      switch (inputType) {
        case "insertText":
          // Insert the new value at the specified position
          // aaa{bbb}ccc
          return (
            prevCode.slice(0, selectionStart) +
            data +
            prevCode.slice(selectionEnd)
          );

        case "insertLineBreak":
          // Insert a newline at the specified position
          return (
            prevCode.slice(0, selectionStart) +
            "\n" +
            prevCode.slice(selectionEnd)
          );

        case "deleteContentBackward":
          // Handle deletion of selected range or single character
          // aaa-{bbb}ccc
          const deleteStart =
            selectionEnd - selectionStart > 0
              ? selectionStart
              : selectionStart - 1;
          const stringDeleted = prevCode.slice(deleteStart, selectionEnd);
          return prevCode.slice(0, deleteStart) + prevCode.slice(selectionEnd);

        case "deleteContentForward":
          // Handle deletion of selected range or single character
          const deleteEnd = selectionEnd + 1;
          return prevCode.slice(0, selectionStart) + prevCode.slice(deleteEnd);

        case "deleteHardLineBackward":
          // Handle deletion of the line before the cursor
          const endOfLastNewline = prevCode.lastIndexOf(
            "\n",
            selectionStart - 1
          );
          return (
            prevCode.slice(0, endOfLastNewline + 1) +
            prevCode.slice(selectionEnd)
          );

        case "insertFromPaste":
          // Handle paste operation
          return (
            prevCode.slice(0, selectionStart) +
            data +
            prevCode.slice(selectionEnd)
          );

        case "historyUndo":
          // Prevent undo operation
          return prevCode;

        case "deleteWordBackward":
          // Handle deletion of the word before the cursor
          const isWhitespaceOrPunctuation = (char: string) =>
            /\s|[.,!?;:(){}[\]]/.test(char);

          let start = selectionStart - 1;

          // Move cursor backward through any trailing whitespace or punctuation
          while (start >= 0 && isWhitespaceOrPunctuation(prevCode[start])) {
            start--;
          }

          // Move cursor backward through the actual word
          while (start >= 0 && !isWhitespaceOrPunctuation(prevCode[start])) {
            start--;
          }

          // Adjust start to properly slice the string
          const deletionPoint = start + 1;

          // Return the new string after deleting the word
          return (
            prevCode.slice(0, deletionPoint) + prevCode.slice(selectionEnd)
          );

        default:
          console.error("Unknown operation type:", inputType);
          return prevCode;
      }
    });
  };

  // Capture the input event and emit the operation to the server
  const onInputCapture = (
    e: FormEvent<HTMLTextAreaElement>,
    setStateAction: Dispatch<SetStateAction<string>>
  ) => {
    const { inputType, data } = e.nativeEvent as InputEvent;

    const operation = OperationSchema.parse({
      inputType,
      data,
      selectionStart: selections.current.selectionStart,
      selectionEnd: selections.current.selectionEnd,
    });

    // For logging purposes
    console.log(operation);
    setOperation(operation);

    // Simulate emitting and applying the operation
    // socket.emit("operation", operation);
    applyOperation(operation, setStateAction);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1>Page</h1>

      <div className="flex flex-row w-full h-full gap-4">
        <p className="w-full">User's screen</p>
        <p className="w-full">Matched user's screen</p>
      </div>

      <div className="flex flex-row w-full h-full gap-4">
        <textarea
          ref={ref}
          value={code}
          onChange={(e) => {
            onInputCapture(e, setCode);
            onInputCapture(e, setAnotherCode);
          }}
          onKeyDown={(e) => {
            if (!ref.current) {
              return;
            }
            selections.current.selectionStart = ref.current.selectionStart;
            selections.current.selectionEnd = ref.current.selectionEnd;
            if (e.key === "Tab") {
              const { selectionStart, selectionEnd, value } = ref.current;

              const operation = OperationSchema.parse({
                inputType: "insertText",
                data: "\t",
                selectionStart,
                selectionEnd,
              });

              applyOperation(operation, setCode);
              applyOperation(operation, setAnotherCode);

              setTimeout(() => {
                if (!ref.current) {
                  return;
                }
                const newPosition = selectionStart + 1; // After the tab character
                ref.current.selectionStart = newPosition;
                ref.current.selectionEnd = newPosition;
              });

              e.preventDefault();
            }
          }}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
          className="w-full h-64 text-primary bg-background"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
        <textarea
          value={anotherCode}
          onChange={(e) => {
            onInputCapture(e, setAnotherCode);
            onInputCapture(e, setCode);
          }}
          className="w-full h-64 text-primary bg-background"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
      </div>

      <div className="flex flex-col w-full">
        <p>Operation Captured</p>
        <pre>{JSON.stringify(operation, undefined, 2)}</pre>
        <p>Match: {match ? "True" : "False"}</p>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          onClick={() => {
            console.log(code);
          }}
        >
          Log content
        </Button>
        <Button
          onClick={() => {
            setAnotherCode(code);
          }}
        >
          Sync content
        </Button>
      </div>
    </div>
  );
}
