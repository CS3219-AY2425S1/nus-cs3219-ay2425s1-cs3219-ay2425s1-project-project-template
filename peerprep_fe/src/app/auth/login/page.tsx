import Image from "next/image";
import Header from "@/components/header";
import Textfield from "@/components/text-field";
import Button from "@/components/button";
import TextButton from "@/components/text-button";

export default function Login() {
  return (
    <div className="h-screen w-screen flex flex-col max-w-6xl mx-auto py-10">
      <Header />

      <main className="relative mx-5 flex space-x-20 items-center flex-1">
        <div className="w-1/2 pl-10">
          <Textfield secure={false} placeholder_text="Email" />
          <Textfield secure={true} placeholder_text="Password" />
          <Button text="Login" />

          <div className="mt-5">
            <p className="text-sm font-hairline">
              Need an account?{" "}
              <TextButton text="Sign Up" link="/auth/signup" />
            </p>
          </div>
        </div>

        <Image
          className="w-1/2"
          src="/icons/landing_icon.png"
          alt="Landing page icon"
          width={384}
          height={384}
          priority
        />
      </main>
    </div>

    
  );
}
