"use client";

import { Button } from "@/components/ui/button";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";

import { z } from "zod";

const OperationSchema = z.object({
  inputType: z.string(),
  data: z.string().nullable(),
  value: z.string(),
  selectionStart: z.number(),
  selectionEnd: z.number(),
  lengthDifference: z.number(),
});

type Operation = z.infer<typeof OperationSchema>;

export default function Page() {
  const [code, setCode] = useState("");
  const [anotherCode, setAnotherCode] = useState("");

  const match: boolean = useMemo(() => {
    return code === anotherCode;
  }, [code, anotherCode]);

  // Apply the operation when it is received from the server
  const applyOperation = (
    operation: Operation,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    const {
      inputType,
      data,
      value,
      selectionStart,
      selectionEnd,
      lengthDifference,
    } = operation;

    // Apply the operation to current code
    setter((prevCode: string) => {
      switch (inputType) {
        case "insertText":
          // Insert the new value at the specified position
          // aaa{bbb}ccc
          return (
            prevCode.slice(0, selectionStart - 1) +
            data +
            prevCode.slice(selectionEnd + lengthDifference)
          );

        case "insertLineBreak":
          // Insert a newline at the specified position
          // aaa{\n}bbb
          return (
            prevCode.slice(0, selectionStart - 1) +
            "\n" +
            prevCode.slice(selectionEnd + lengthDifference)
          );

        case "deleteContentBackward":
          // Handle deletion of selected range or single character
          // aaa-{bbb}ccc
          return (
            prevCode.slice(0, selectionStart) +
            prevCode.slice(selectionEnd + lengthDifference)
          );

        case "deleteContentForward":
          // Handle deletion of selected range or single character
          return (
            prevCode.slice(0, selectionStart) +
            prevCode.slice(selectionEnd + lengthDifference)
          );

        case "deleteHardLineBackward":
          // Handle deletion of the line before the cursor
          return (
            prevCode.slice(0, selectionStart) +
            prevCode.slice(selectionEnd + lengthDifference)
          );

        case "insertFromPaste":
          // Handle paste operation
          return (
            prevCode.slice(0, selectionStart + lengthDifference) +
            data +
            prevCode.slice(selectionEnd + lengthDifference)
          );

        case "historyUndo":
          // Handle undo operation
          return value;

        case "deleteWordBackward":
          // Handle deletion of the word before the cursor
          return (
            prevCode.slice(0, selectionStart) +
            prevCode.slice(selectionEnd + lengthDifference)
          );

        default:
          console.error("Unknown operation type:", inputType);
          return prevCode;
      }
    });
  };

  const [operation, setOperation] = useState<Operation | null>(null);

  // SelectionEnd and SelectionStart are not updated in the input event
  const previousSelection = useRef({
    start: 0,
    end: 0,
    value: "",
    textLength: 0,
  });

  // Capture the input event and emit the operation to the server
  const onInputCapture = (
    e: FormEvent<HTMLTextAreaElement>,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    const { inputType, data } = e.nativeEvent as InputEvent;

    const { value, textLength, selectionStart, selectionEnd } = e.currentTarget;

    // Calculate the difference in the length of the previous and current values
    const lengthDifference = previousSelection.current.textLength - textLength;

    const operation = OperationSchema.parse({
      inputType,
      data,
      value,
      lengthDifference,
      selectionStart,
      selectionEnd,
    });

    // For logging purposes
    console.log(operation);
    setOperation(operation);

    // Simulate emitting and applying the operation
    applyOperation(operation, setter);

    previousSelection.current = {
      start: selectionStart,
      end: selectionEnd,
      value,
      textLength,
    };
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
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            onInputCapture(e, setAnotherCode);
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
            setAnotherCode(e.target.value);
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
