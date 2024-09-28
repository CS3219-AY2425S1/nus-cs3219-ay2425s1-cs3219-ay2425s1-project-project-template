"use client";

import { useFormState } from "react-dom";
import Textfield from "@/components/text-field";
import Button from "@/components/button";
import TextButton from "@/components/text-button";
import { signup } from "@/app/actions/auth";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/auth-provider";

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined);
  const router = useRouter();
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    if (state?.message) {
      const { setToken } = useContext(AuthContext);
      router.push("/home");
    } else if (state?.errors?.errorMessage) {
      alert(state.errors.errorMessage);
    }
  }, [state]);

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
