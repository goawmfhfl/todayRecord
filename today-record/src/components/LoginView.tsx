"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useLogin, useKakaoLogin } from "@/hooks/useLogin";
import { AuthHeader } from "./forms/AuthHeader";
import { EmailField } from "./forms/EmailField";
import { PasswordField } from "./forms/PasswordField";
import { SubmitButton } from "./forms/SubmitButton";
import { useRouter } from "next/navigation";

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // React Query mutation 사용
  const router = useRouter();
  const loginMutation = useLogin();
  const kakaoLoginMutation = useKakaoLogin();

  // Email validation
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // Validate email
    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(email)) {
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    }

    // Validate password
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // React Query mutation 실행
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("use Mutation 로그인 성공:", data);
          router.push("/");
        },
        onError: (error: any) => {
          console.error("use Mutation 로그인 실패:", error.message);
          setErrors({ general: error.message });
        },
      }
    );
  };

  const isFormValid = Boolean(email && password);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      <div className="w-full max-w-md">
        <AuthHeader
          title="myRecord"
          subtitle="기록하면, 피드백이 따라옵니다."
        />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-busy={loginMutation.isPending}
        >
          {/* General Error */}
          {errors.general && (
            <div
              className="p-4 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: "#FEE2E2",
                border: "1px solid #EF4444",
              }}
            >
              <AlertCircle
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "#EF4444" }}
              />
              <p style={{ color: "#991B1B", fontSize: "0.9rem" }}>
                {errors.general}
              </p>
            </div>
          )}

          <EmailField
            value={email}
            onChange={(value) => {
              setEmail(value);
              setErrors((prev) => ({
                ...prev,
                email: undefined,
                general: undefined,
              }));
            }}
            placeholder="example@gmail.com"
            error={errors.email}
          />

          <PasswordField
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors((prev) => ({
                ...prev,
                password: undefined,
                general: undefined,
              }));
            }}
            placeholder="비밀번호를 입력하세요"
            error={errors.password}
          />

          <SubmitButton
            isLoading={loginMutation.isPending}
            isValid={isFormValid}
            loadingText="로그인 중..."
            defaultText="로그인"
          />

          {/* Divider */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: "#EFE9E3" }}
              />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-4"
                style={{
                  backgroundColor: "#FAFAF8",
                  color: "#4E4B46",
                  opacity: 0.6,
                  fontSize: "0.8rem",
                }}
              >
                간편 로그인
              </span>
            </div>
          </div>

          {/* OAuth Buttons - Horizontal Icons */}
          <div className="flex items-center justify-center gap-4">
            {/* Kakao Login */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  console.log("Kakao OAuth login");
                  kakaoLoginMutation.mutate();
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                style={{
                  backgroundColor: "#FEE500",
                }}
                title="카카오 로그인 (기존 회원만)"
                disabled={kakaoLoginMutation.isPending}
              >
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 3C5.58172 3 2 5.89543 2 9.5C2 11.6484 3.23828 13.5391 5.17188 14.6953L4.30469 17.8359C4.25781 18.0078 4.42969 18.1641 4.59375 18.0781L8.35938 15.8203C8.89844 15.9141 9.44531 15.9766 10 15.9766C14.4183 15.9766 18 13.0811 18 9.47656C18 5.87201 14.4183 3 10 3Z"
                    fill="#000000"
                  />
                </svg>
              </button>
            </div>

            {/* Naver Login */}
            <button
              type="button"
              onClick={() => {
                console.log("Naver OAuth login");
                setTimeout(() => {
                  router.push("/");
                }, 1000);
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:opacity-80"
              style={{
                backgroundColor: "#03C75A",
              }}
              title="네이버 로그인"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M11.5 10L6.5 3H6v14h4.5V10z" fill="#FFFFFF" />
                <path d="M8.5 10l5 7H14V3H9.5v7z" fill="#FFFFFF" />
              </svg>
            </button>

            {/* Google Login */}
            <button
              type="button"
              onClick={() => {
                console.log("Google OAuth login");
                setTimeout(() => {
                  router.push("/");
                }, 1000);
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-gray-50"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EFE9E3",
              }}
              title="Google 로그인"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M18.1711 8.36793H17.5V8.33334H10V11.6667H14.7096C14.0225 13.6071 12.1762 15 10 15C7.23875 15 5 12.7613 5 10C5 7.23876 7.23875 5.00001 10 5.00001C11.2746 5.00001 12.4342 5.48084 13.3171 6.26626L15.6742 3.90918C14.1858 2.52209 12.1933 1.66667 10 1.66667C5.39791 1.66667 1.66666 5.39793 1.66666 10C1.66666 14.6021 5.39791 18.3333 10 18.3333C14.6021 18.3333 18.3333 14.6021 18.3333 10C18.3333 9.44126 18.2758 8.89584 18.1711 8.36793Z"
                  fill="#FFC107"
                />
                <path
                  d="M2.6275 6.12126L5.36542 8.12917C6.10625 6.29501 7.90042 5.00001 10 5.00001C11.2746 5.00001 12.4342 5.48084 13.3171 6.26626L15.6742 3.90918C14.1858 2.52209 12.1933 1.66667 10 1.66667C6.79917 1.66667 4.02333 3.47376 2.6275 6.12126Z"
                  fill="#FF3D00"
                />
                <path
                  d="M10 18.3333C12.1525 18.3333 14.1083 17.5096 15.5871 16.17L13.0079 13.9875C12.1431 14.6452 11.0864 15.0009 10 15C7.83249 15 5.99207 13.6179 5.29874 11.6892L2.58124 13.7829C3.96041 16.4817 6.76124 18.3333 10 18.3333Z"
                  fill="#4CAF50"
                />
                <path
                  d="M18.1712 8.36792H17.5V8.33334H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1696C15.4046 16.3354 18.3333 14.1667 18.3333 10C18.3333 9.44126 18.2758 8.89584 18.1712 8.36792Z"
                  fill="#1976D2"
                />
              </svg>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="underline"
              style={{ color: "#6B7A6F", fontSize: "0.9rem" }}
            >
              계정이 없으신가요? 회원가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
