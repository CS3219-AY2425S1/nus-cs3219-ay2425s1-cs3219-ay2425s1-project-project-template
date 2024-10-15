"use client";

import MatchingForm from "@/components/forms/MatchingForm";
import DefaultLayout from "@/layouts/default";

const MatchPage = () => {
  return (
    <>
      <DefaultLayout isLoggedIn={true}>
        <MatchingForm />
      </DefaultLayout>
    </>
  );
};

export default MatchPage;
