import { Button } from "@nextui-org/button";
import { SignInButton } from "@clerk/nextjs";

export const SignInButtonWrapped = () => {
  return (
    <SignInButton>
      <Button variant="light">
        <u>Sign-in</u>
      </Button>
    </SignInButton>
  );
};
