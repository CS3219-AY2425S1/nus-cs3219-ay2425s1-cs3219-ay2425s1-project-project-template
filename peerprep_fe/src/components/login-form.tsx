"use client";

import { useFormState, useFormStatus } from "react-dom";
import Textfield from "@/components/text-field";
import Button from "@/components/button";
import TextButton from "@/components/text-button";
import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action] = useFormState(login, undefined);

  return (
    <form action={action}>
      <Textfield name="email" secure={false} placeholder_text="Email" />
      {state?.errors?.email && <p>{state.errors.email}</p>}
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
      <Button type="submit" text="Login" />

      <div className="mt-5">
        <p className="text-sm font-hairline">
          Need an account? <TextButton text="Sign Up" link="/auth/signup" />
        </p>
      </div>
    </form>
  );
}
