import CodeSnippet from "@/app/(home)/components/code-snippet/CodeSnippetHighlight";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GoogleIcon from "@/app/(home)/components/icon/GoogleIcon";
import { useAuth } from "@/components/auth/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const LandingPage = () => {
    const { login, token } = useAuth();
    const router = useRouter();

    const googleLogin = useGoogleLogin({
        onSuccess: (response) => {
            login(response);
            //router.push("/leetcode-dashboard"); // Redirect to dashboard after successful login
        },
        onError: (error) => {
            console.error("Login Failed:", error);
        },
    });

    // Trigger OAuth pop up only if user is not authenticated (token is not present)
    const handleLogin = () => {
        if (token) {
            router.push("/leetcode-dashboard");
        } else {
            googleLogin();
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <div className="flex justify-between max-w-[90vw]">
                <div className="flex-1 pr-10 h-full">
                    <h1 className="text-6xl font-extrabold text-white pb-8">
                        Collaborative Coding, Competitive Results.
                    </h1>
                    <p className="font-normal text-white pb-8">
                        Join PeerPrep to sharpen your skills through real-time problem-solving, and prepare to outshine in every interview.
                        Created for CS3219 Software Engineering Principles AY24/25 by Group 15.
                    </p>
                    <div className="pt-8">
                        <Button className="font-semibold w-full" onClick={() => handleLogin()}>
                                <GoogleIcon/>
                                <span className="pl-2">Get Started with Google</span>
                            </Button>
                    </div>
                </div>
                <div className="flex-1 h-full">
                    <Card className="bg-primary-1000 border-none pt-2 pb-2 max-w-[90vw] h-full drop-shadow">
                        <CardContent className="h-full">
                            <CodeSnippet />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;