"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

export function SignUpView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAI, setAgreeAI] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    terms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  // Email validation
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasMinLength && hasLetter && hasNumber;
  };

  // Check email on blur (mock API call)
  const handleEmailBlur = async () => {
    if (!email) return;

    if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일 형식이 올바르지 않습니다.",
      }));
      setEmailCheckStatus("idle");
      return;
    }

    setEmailCheckStatus("checking");

    // Mock API call with delay
    setTimeout(() => {
      // Simulate random availability (for demo purposes)
      const isAvailable = !email.includes("taken");

      if (isAvailable) {
        setEmailCheckStatus("available");
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else {
        setEmailCheckStatus("taken");
        setErrors((prev) => ({
          ...prev,
          email: "이미 사용 중인 이메일입니다.",
        }));
      }
    }, 300);
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
    } else if (emailCheckStatus === "taken") {
      newErrors.email = "이미 사용 중인 이메일입니다.";
    }

    // Validate password
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "비밀번호는 영문과 숫자를 포함해 8자 이상 입력해주세요.";
    }

    // Validate terms
    if (!agreeTerms || !agreeAI) {
      newErrors.terms = "필수 약관에 동의해주세요.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      console.log("Sign up successful", { email });
      // Store in localStorage for demo
      localStorage.setItem("myRecord_user", JSON.stringify({ email }));
      setIsSubmitting(false);
    }, 1000);
  };

  const isFormValid =
    email && password && agreeTerms && agreeAI && emailCheckStatus !== "taken";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ color: "#6B7A6F", fontSize: "2rem" }}>
            myRecord
          </h1>
          <p style={{ color: "#4E4B46", opacity: 0.8, fontSize: "1rem" }}>
            기록하면, 피드백이 따라옵니다.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              className="block mb-2"
              style={{ color: "#333333", fontSize: "0.9rem" }}
            >
              이메일
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#6B7A6F", opacity: 0.5 }}
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailCheckStatus("idle");
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={handleEmailBlur}
                placeholder="example@gmail.com"
                className="pl-11 pr-10"
                style={{
                  borderColor: errors.email
                    ? "#EF4444"
                    : emailCheckStatus === "available"
                    ? "#10B981"
                    : "#EFE9E3",
                  backgroundColor: "white",
                }}
              />
              {emailCheckStatus === "checking" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "#6B7A6F" }}
                  />
                </div>
              )}
              {emailCheckStatus === "available" && (
                <CheckCircle2
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "#10B981" }}
                />
              )}
              {emailCheckStatus === "taken" && (
                <AlertCircle
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "#EF4444" }}
                />
              )}
            </div>
            {errors.email && (
              <p
                className="mt-1.5 flex items-center gap-1"
                style={{ color: "#EF4444", fontSize: "0.8rem" }}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              className="block mb-2"
              style={{ color: "#333333", fontSize: "0.9rem" }}
            >
              비밀번호
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#6B7A6F", opacity: 0.5 }}
              />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="영문+숫자 8자 이상 입력"
                className="pl-11 pr-10"
                style={{
                  borderColor: errors.password ? "#EF4444" : "#EFE9E3",
                  backgroundColor: "white",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff
                    className="w-5 h-5"
                    style={{ color: "#6B7A6F", opacity: 0.5 }}
                  />
                ) : (
                  <Eye
                    className="w-5 h-5"
                    style={{ color: "#6B7A6F", opacity: 0.5 }}
                  />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                className="mt-1.5 flex items-center gap-1"
                style={{ color: "#EF4444", fontSize: "0.8rem" }}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => {
                  setAgreeTerms(checked === true);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="mt-0.5"
              />
              <label
                htmlFor="terms"
                className="flex-1 cursor-pointer"
                style={{ color: "#333333", fontSize: "0.9rem" }}
              >
                <span style={{ color: "#EF4444" }}>[필수]</span> 이용약관 및
                개인정보 수집·이용 동의{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="underline"
                  style={{ color: "#6B7A6F" }}
                >
                  (보기)
                </button>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="ai"
                checked={agreeAI}
                onCheckedChange={(checked) => {
                  setAgreeAI(checked === true);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="mt-0.5"
              />
              <label
                htmlFor="ai"
                className="flex-1 cursor-pointer"
                style={{ color: "#333333", fontSize: "0.9rem" }}
              >
                <span style={{ color: "#EF4444" }}>[필수]</span> AI 피드백
                데이터 학습 활용 동의{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAIModal(true);
                  }}
                  className="underline"
                  style={{ color: "#6B7A6F" }}
                >
                  (보기)
                </button>
              </label>
            </div>

            {errors.terms && (
              <p
                className="flex items-center gap-1"
                style={{ color: "#EF4444", fontSize: "0.8rem" }}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.terms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-6 rounded-xl transition-all"
            style={{
              backgroundColor:
                isFormValid && !isSubmitting ? "#6B7A6F" : "#D1D5DB",
              color: "white",
              fontSize: "1rem",
              opacity: isFormValid && !isSubmitting ? 1 : 0.6,
            }}
          >
            {isSubmitting ? "가입 중..." : "가입하고 시작하기"}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              className="underline"
              style={{ color: "#6B7A6F", fontSize: "0.9rem" }}
            >
              이미 계정이 있으신가요? 로그인하기
            </button>
          </div>
        </form>
      </div>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>이용약관 및 개인정보 수집·이용 동의</DialogTitle>
          </DialogHeader>
          <DialogDescription
            className="space-y-4"
            style={{ color: "#333333", lineHeight: "1.7" }}
          >
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                1. 개인정보 수집 항목
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                - 이메일 주소
                <br />- 비밀번호 (암호화 저장)
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                2. 수집 목적
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                - 회원 식별 및 계정 관리
                <br />
                - AI 기반 저널링 피드백 제공
                <br />- 서비스 개선 및 사용자 경험 향상
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                3. 보관 및 삭제 정책
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                개인정보는 회원 탈퇴 시 즉시 삭제되며, 법령에 따라 보관이 필요한
                경우를 제외하고는 별도로 보관하지 않습니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                4. 동의 철회
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                언제든지 계정 설정에서 회원 탈퇴를 통해 동의를 철회할 수
                있습니다.
              </p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* AI Data Modal */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI 피드백 데이터 학습 활용 동의</DialogTitle>
          </DialogHeader>
          <DialogDescription
            className="space-y-4"
            style={{ color: "#333333", lineHeight: "1.7" }}
          >
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                1. 데이터 활용 방식
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                사용자가 작성한 일상 기록은 AI 피드백 생성에 활용되며, 서비스
                품질 향상을 위해 익명화된 형태로 학습 데이터로 사용될 수
                있습니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                2. 익명화 처리
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                학습에 활용되는 모든 데이터는 개인 식별이 불가능하도록 익명화
                처리됩니다. 이메일 등 개인정보는 학습 데이터에 포함되지
                않습니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                3. 보안
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                데이터는 암호화되어 안전하게 저장되며, 외부 유출 방지를 위한
                보안 조치가 적용됩니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                4. 동의 철회
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                언제든지 계정 설정에서 AI 학습 활용 동의를 철회할 수 있으며,
                철회 즉시 이후 데이터는 학습에 사용되지 않습니다.
              </p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
