import React from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/button";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";  
import { useResetPassword } from "@/hooks/auth";  // Adjust based on your project
import DefaultLayout from "@/layouts/default";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query; 
  const tokenString: string = (
    Array.isArray(token) ? token[0] : token
  ) as string; 
  const { mutate: resetPassword, isPending, isError, error } = useResetPassword();

  const handleResetPassword = (newPassword: string, confirmPassword: string) => {
    if (!tokenString) {
      console.error("Token is missing from the URL");
      return;
    }

    // Call mutation to reset password with token and new password
    resetPassword(
      { tokenString, newPassword }, 
      {
        onSuccess: () => {
          console.log("Password reset successfully!");
          router.push("/login");  // Redirect to login on success
        },
        onError: (err) => {
          console.error("Password reset failed:", err);
        },
      }
    );
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <DefaultLayout isLoggedIn={false}>
      <div className="flex items-start justify-center pt-[25vh]">
        <div
          className="w-full max-w-lg p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: "#19191b" }}
        >
          <h2 className="text-3xl font-semibold text-center text-white">
            Reset Your Password
          </h2>

          {/* ResetPasswordForm component, passing required props */}
          <ResetPasswordForm
            onSubmit={handleResetPassword}
          />

          <div className="mt-6 text-center">
            <Button className="mt-2" onClick={handleLogin}>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ResetPasswordPage;

