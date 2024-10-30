import { getSessionInfo } from "@/services/collaborationService";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import QuestionTabPanel from "@/app/collaboration/_components/Question";
import Chatbox from "../_components/Chat/Chatbox";
import { redirect } from "next/navigation";
import CenterPanel from "../_components/CenterPanel";
import { UserProfile, UserProfileResponse, UserProfileSchema } from "@/types/User";
import { getCurrentUser } from "@/services/userService";

export default async function Page({
  params,
}: {
  params: { sessionId: string };
}) {
  const { sessionId } = params;

  const sessionInfoResponse = await getSessionInfo(sessionId);

  const userProfileResponse: UserProfileResponse = await getCurrentUser();
  const parsedProfile = UserProfileSchema.safeParse(userProfileResponse.data);
  

  if (sessionInfoResponse.statusCode !== 200 || !sessionInfoResponse.data || userProfileResponse.statusCode !== 200 || !parsedProfile.success) {
    redirect("/dashboard");
  }

  const userProfile: UserProfile = parsedProfile.data;

  const chatFeature = process.env.NEXT_PUBLIC_CHAT_FEATURE === "true";

  return (
    <div className="flex flex-row w-full h-full overflow-hidden">
      <ResizablePanelGroup
        className="flex w-full h-full"
        direction="horizontal"
      >
        <ResizablePanel className="p-1" defaultSize={30}>
          <QuestionTabPanel />
        </ResizablePanel>

        <ResizableHandle withHandle={true} />

        <ResizablePanel defaultSize={70}>
          <CenterPanel sessionId={sessionId} userProfile={userProfile}/>
        </ResizablePanel>
      </ResizablePanelGroup>

      {chatFeature && (
        <div className="flex p-1">
          <Chatbox />
        </div>
      )}
    </div>
  );
}
