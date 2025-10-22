"use client";

import { LoginView } from "@/components/LoginView";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (email?: string) => {
    router.push("/");
  };

  const handleNavigateToSignUp = () => {
    router.push("/signup");
  };

  return (
    <LoginView
      onLoginSuccess={handleLoginSuccess}
      onNavigateToSignUp={handleNavigateToSignUp}
    />
  );
}
