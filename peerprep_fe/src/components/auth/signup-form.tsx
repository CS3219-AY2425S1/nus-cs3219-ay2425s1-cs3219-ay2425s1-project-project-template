"use client";

import { useFormState, useFormStatus } from "react-dom";
import Textfield from "@/components/common/text-field";
import Button from "@/components/common/button";
import TextButton from "@/components/common/text-button";
import { signup } from "@/app/actions/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      localStorage.setItem("token", state.message);
      router.push("/home");
    } else if (state?.errors?.errorMessage) {
      alert(state.errors.errorMessage);
    }
  }, [state]);

  // TODO: Make errors look better
  return (
    <div>
      <form action={action}>
        <div>
          <Textfield name="username" secure={false} placeholder_text="Name" />
          <p className="error">{state?.errors?.name}</p>
        </div>
        <div>
          <Textfield name="email" secure={false} placeholder_text="Email" />
          <p className="error">{state?.errors?.email}</p>
        </div>
        <div>
          <Textfield
            name="password"
            secure={true}
            placeholder_text="Password"
          />
          <p className="error">{state?.errors?.password}</p>
        </div>
        <Button type="submit" text="Sign Up" />
      </form>

      <div className="mt-5">
        <p className="text-sm font-hairline">
          Already have an account?{" "}
          <TextButton text="Login" link="/auth/login" />
        </p>
      </div>
    </div>
  );
}
