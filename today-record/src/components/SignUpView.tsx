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
                제1조 (목적)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                본 약관은 myRecord(이하 “서비스”)가 제공하는 기록 및 AI 피드백
                기능을 이용함에 있어, 이용자와 서비스 운영자 간의 권리·의무를
                규정함을 목적으로 합니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제2조 (수집하는 개인정보 항목)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                서비스는 회원가입 및 기록 피드백 제공을 위해 아래 정보를
                수집합니다.
                {/* 모바일용 간단한 카드 레이아웃 */}
                <div className="block md:hidden mt-4 space-y-2">
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        필수
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1">
                        <span className="font-medium">수집 항목:</span> 이메일,
                        비밀번호, 닉네임
                      </div>
                      <div>
                        <span className="font-medium">수집 목적:</span> 회원
                        식별, 로그인, 계정 관리
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        선택
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1">
                        <span className="font-medium">수집 항목:</span> 생년,
                        성별
                      </div>
                      <div>
                        <span className="font-medium">수집 목적:</span> 개인화
                        피드백 제공
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        자동 수집
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1">
                        <span className="font-medium">수집 항목:</span> 접속기기
                        정보, 이용 로그, 쿠키
                      </div>
                      <div>
                        <span className="font-medium">수집 목적:</span> 서비스
                        안정성 및 품질 개선
                      </div>
                    </div>
                  </div>
                </div>
                {/* 태블릿/데스크탑용 깔끔한 테이블 레이아웃 */}
                <div className="hidden md:block mt-4">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                            구분
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                            수집 항목
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                            수집 목적
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">
                            필수
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            이메일, 비밀번호, 닉네임
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            회원 식별, 로그인, 계정 관리
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">
                            선택
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            생년, 성별
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            개인화 피드백 제공
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">
                            수집
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            접속기기 정보, 이용 로그, 쿠키
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            서비스 안정성 및 품질 개선
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제3조 (개인정보의 이용 목적)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                수집된 개인정보는 아래 목적으로 이용됩니다.
                <br /> 1. 회원 식별 및 서비스 제공
                <br /> 2. 기록 데이터 저장 및 피드백 분석
                <br /> 3. 서비스 개선 및 신규 기능 개발
                <br /> 4. 고객 문의 대응 및 공지사항 전달
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제4조 (보관 및 파기)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                - 회원 탈퇴 시 모든 개인정보는 즉시 삭제됩니다.
                <br /> - 단, 법령상 보존이 필요한 경우 관련 법령에 따라 일정
                기간 보관 후 파기합니다.
              </p>
            </div>

            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제5조 (이용자의 권리)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제를 요청할 수
                있으며, 문의 메일을 통해 요청할 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제6조 (기타)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                기타 개인정보 처리에 관한 세부 내용은 별도의 「개인정보
                처리방침」에 따릅니다.
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
                제1조 (수집 및 활용 목적)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                서비스는 이용자의 기록 데이터를 바탕으로 AI 피드백을 제공합니다.
                AI의 품질 향상을 위해 일부 데이터는 익명화 처리 후 학습 데이터로
                활용 될 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제2조 (수집 및 처리 범위)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                1. 사용자가 작성한 기록의 본문 내용
                <br /> 2. 피드백 결과 및 사용자 만족도 점수
                <br /> 3. 비식별화된 메타데이터 (날짜, 키워드 등)
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제3조 (익명화 처리 방식)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                - 개인을 식별할 수 있는 정보(이메일, 이름 등)는 학습 전에 완전
                제거됩니다.
                <br /> - 학습 데이터는 통계적 분석 및 모델 개선 용도로만
                사용되며, 외부 공개되지 않습니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제4조 (보관 기간)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                회원 탈퇴 시, 학습용 데이터는 즉시 삭제되며, 이미 학습된 모델에
                반영된 데이터는 개별 삭제가 불가능합니다.
              </p>
            </div>
            <div>
              <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
                제5조 (문의처)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
                AI 데이터 처리 관련 문의는 아래로 연락 가능합니다.
                <br /> ✉️ goawmfhfl1@naver.com
                <br /> 담당자: 개인정보보호 책임자 최재영
              </p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
