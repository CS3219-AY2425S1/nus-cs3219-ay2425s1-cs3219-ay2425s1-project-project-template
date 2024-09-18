"use client";

import { useFormState, useFormStatus } from "react-dom";
import Textfield from "@/components/text-field";
import Button from "@/components/button";
import TextButton from "@/components/text-button";
import { signup } from "@/app/actions/auth";

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined);

  return (
    <form action={action}>
      <div>
        <Textfield name="username" secure={false} placeholder_text="Name" />
        {state?.errors?.name && <p>{state.errors.name}</p>}
      </div>
      <div>
        <Textfield name="email" secure={false} placeholder_text="Email" />
        {state?.errors?.email && <p>{state.errors.email}</p>}
      </div>
      <div>
        <Textfield name="password" secure={true} placeholder_text="Password" />
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button type="submit" text="Sign Up" />

      <div className="mt-5">
        <p className="text-sm font-hairline">
          Already have an account?{" "}
          <TextButton text="Login" link="/auth/login" />
        </p>
      </div>
    </form>
  );
}
