import Topbar from "@/components/Topbar";

export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <main>{children}</main>
    </>
  );
}
