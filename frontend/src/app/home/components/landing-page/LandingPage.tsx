import CodeSnippet from "@/app/home/components/code-snippet/CodeSnippetHighlight";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GoogleIcon from "@/app/home/components/icon/GoogleIcon";
import { useAuth } from "@/components/auth/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LandingPage = () => {
    const { login, token } = useAuth();
    const router = useRouter();

    const googleLogin = useGoogleLogin({
        onSuccess: (response) => login(response),
        onError: (error) => {
            console.error("Login Failed:", error);
        },
    });

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    const handleLogin = () => {
        if (token) {
            router.push("/");
        } else {
            googleLogin();
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <div className="flex items-center justify-between max-w-7xl w-full">
                <div className="flex-col basis-3/4 pr-8">
                    <h1 className="text-6xl font-extrabold text-white pb-5">
                        Collaborative Coding, Competitive Results.
                    </h1>
                    <p className="font-normal text-white pb-5">
                        Join PeerPrep to sharpen your skills through real-time problem-solving, and prepare to outshine in every interview.
                        Created for CS3219 Software Engineering Principles AY24/25 by Group 15.
                    </p>
                    <Button className="mt-6 font-semibold w-full" onClick={() => handleLogin()}>
                        <GoogleIcon/>
                        <span className="pl-2">Get Started with Google</span>
                    </Button>
                </div>
                <div className="flex-col basis-1/4 h-full">
                    <Card className="bg-primary-1000 border-none pt-6 pb-6 w-full h-full drop-shadow">
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