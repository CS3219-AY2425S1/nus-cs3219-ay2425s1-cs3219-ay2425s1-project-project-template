import LoginForm from "@/components/forms/LoginForm";

const LoginPage = () => {
  const handleLogin = (email: string, password: string) => {
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
