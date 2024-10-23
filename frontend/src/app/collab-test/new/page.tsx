/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import YTester2 from "../_components/YTester2";

import { Suspense } from "react";
import MonacoEditor from "../_components/MonacoEditor";

/** A hook to read and set a YText value. */

export default function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MonacoEditor />
      </Suspense>
    </div>
  );
}
