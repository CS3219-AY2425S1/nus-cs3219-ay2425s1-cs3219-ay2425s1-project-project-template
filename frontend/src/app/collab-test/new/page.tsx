import { Suspense } from "react";
import MonacoEditor from "../_components/MonacoEditor";

export default function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MonacoEditor />
      </Suspense>
    </div>
  );
}
