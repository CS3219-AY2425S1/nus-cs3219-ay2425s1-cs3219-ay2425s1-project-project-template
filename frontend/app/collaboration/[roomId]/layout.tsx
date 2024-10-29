import { SocketProvider } from "@/context/SockerIOContext";
import "react-toastify/dist/ReactToastify.css";

export default function CollaborationPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
