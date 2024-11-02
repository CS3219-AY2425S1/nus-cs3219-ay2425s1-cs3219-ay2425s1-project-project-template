import dynamic from "next/dynamic";

export const MonacoEditor = dynamic(
  () => import("@/components/collab/monaco-editor"),
  {
    ssr: false,
  }
);

export default function CollabRoom({
  params,
}: {
  params: { room_id: string };
}) {
  return <MonacoEditor roomId={params.room_id} />;
}
