import { Button } from "../ui/button";

export default function UnauthorisedAccess() {
  return (
    <div className="flex items-start justify-center h-2/6">
      <div className="text-center mt-[20vh]">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Uh Oh! You're not supposed to be here!
        </h1>
        <Button
          size="lg"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
