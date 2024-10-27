import { getCurrentUser } from "@/services/userService";
import { UserProfileResponse, UserProfileSchema } from "@/types/User";
import CollaborativeEditor from "./CollaborativeEditor";

export default async function CollaborativeEditorTab() {
  const userProfileResponse: UserProfileResponse = await getCurrentUser();

  // TODO: Get actual session via getSessionInfo();
  const getSession = "cs3219";

  if (userProfileResponse.statusCode !== 200) {
    return <div>Something went wrong...</div>;
  }

  const userProfile = UserProfileSchema.parse(userProfileResponse.data);

  const socketUrl = process.env.PUBLIC_Y_WEBSOCKET_URL || "ws://localhost:1234";

  return (
    <CollaborativeEditor
      sessionId={getSession}
      currentUser={userProfile}
      socketUrl={socketUrl}
    />
  );
}
