"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
    onSubmit }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      email: e.target.value,
    });
  };

  const handlePasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      password: e.target.value,
    });
  };

  const isValid = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (!formData.email) {
      newErrors.email = true;
    }

    if (!formData.password) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!isValid()) {
      return;
    }

    onSubmit(formData.email, formData.password);
  };

  return (
    <>
      <h2 className="text-4xl font-bold mb-4">Login</h2>
      <div className="flex mb-4">
        <p className="basis-1/4 self-end">Email</p>
        <Input
          errorMessage="Please input your email."
          isInvalid={!!errors.email}
          isRequired={true}
          label="Input Email"
          value={formData.email}
          variant="underlined"
          onChange={handleEmailOnChange}
        />
      </div>
      <div className="flex mb-4">
        <p className="basis-1/4 self-end">Password</p>
        <Input
          errorMessage="Please input your password."
          isInvalid={!!errors.password}
          isRequired={true}
          type="password"
          label="Input Password"
          value={formData.password}
          variant="underlined"
          onChange={handlePasswordOnChange}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button color="danger" onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Login
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
