// frontend/components/forms/LoginForm.tsx

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      onSubmit(formData.email, formData.password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <Input
          value={formData.email}
          onChange={handleEmailOnChange}
          required
          type="email"
        />
        {errors.email && <span>Please provide a valid email</span>}
      </div>
      <div>
        <label>Password</label>
        <Input
          value={formData.password}
          onChange={handlePasswordOnChange}
          required
          type="password"
        />
        {errors.password && <span>Password is required</span>}
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
