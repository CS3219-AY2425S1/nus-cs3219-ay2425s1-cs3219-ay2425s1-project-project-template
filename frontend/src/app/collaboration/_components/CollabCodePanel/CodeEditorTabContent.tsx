import { getCurrentUser } from "@/services/userService";
import { UserProfileResponse, UserProfileSchema } from "@/types/User";
import CollaborativeEditor from "./CollaborativeEditor/CollaborativeEditor";

export default async function CodeEditorTabContent() {
  const userProfileResponse: UserProfileResponse = await getCurrentUser();

  // TODO: Get actual session via getSessionInfo();
  const getSession = "cs3219";

  if (userProfileResponse.statusCode !== 200) {
    return <div>Something went wrong...</div>;
  }

  const userProfile = UserProfileSchema.parse(userProfileResponse.data);

  return (
    <div className="flex flex-col w-full h-full">
      {/* <div className="w-full h-4 bg-background-200"></div> */}
      <CollaborativeEditor sessionId={getSession} currentUser={userProfile} />
    </div>
  );
}
