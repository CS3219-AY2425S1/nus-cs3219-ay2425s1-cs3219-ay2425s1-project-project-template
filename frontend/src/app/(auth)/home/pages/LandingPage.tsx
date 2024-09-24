import { useAuth } from "@/components/auth/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const LandingPage = () => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => login(response),
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const handleLogin = () => {
    googleLogin();
  }

  return (
    <div className="max-w-6xl mx-auto my-10 p-2">
      <h1 className="text-white font-extrabold text-h1">PP Large</h1>
      <button onClick={handleLogin} className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 my-2 rounded-md">login</button>
    </div>
  );
}

export default LandingPage;