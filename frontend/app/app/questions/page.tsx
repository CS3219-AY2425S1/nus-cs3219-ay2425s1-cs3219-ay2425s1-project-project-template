import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import CollabRoom from "@/components/collab/collab-room";
import QuestionListing from "@/components/questions/questions-listing";
import { Suspense } from "react";

export default function QuestionListingPage() {
  return (
    <AuthPageWrapper requireLoggedIn>
      <Suspense>
        {/* <QuestionListing /> */}
        <CollabRoom roomId="1" />
      </Suspense>
    </AuthPageWrapper>
  );
}
