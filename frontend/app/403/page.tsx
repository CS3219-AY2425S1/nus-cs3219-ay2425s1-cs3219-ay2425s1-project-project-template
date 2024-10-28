import DefaultLayout from "@/layouts/default";

export default function Page() {
  return (
    <>
      <DefaultLayout isLoggedIn={true}>
        <div className="flex justify-center">
          <p>403 Forbidden Access</p>
        </div>
      </DefaultLayout>
    </>
  );
}
