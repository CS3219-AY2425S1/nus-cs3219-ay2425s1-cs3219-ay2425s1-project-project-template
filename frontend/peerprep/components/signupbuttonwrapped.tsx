import { Button } from "@nextui-org/button";
import { SignUpButton } from "@clerk/nextjs";

interface SignUpButtonWrappedProps {
  label: string;
}

export const SignUpButtonWrapped: React.FC<SignUpButtonWrappedProps> = ({
  label,
}) => {
  return (
    <SignUpButton>
      <Button
        radius="md"
        className="hover:bg-gradient-to-tr from-fuchsia-500 to-violet-600 text-violet-600 hover:text-white dark:text-white shadow-lg"
        variant="bordered"
        color="secondary"
      >
        {label}
      </Button>
    </SignUpButton>
  );
};
