import QuestionListing from "@/components/questions/questions-listing";
import { Suspense } from "react";

export default function QuestionListingPage() {
  return (
    <Suspense>
      <QuestionListing />
    </Suspense>
  );
}
