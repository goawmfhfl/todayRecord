"use client";

import { useState } from "react";
import { useSignUp } from "@/hooks/useSignUp";
import { AuthHeader } from "./forms/AuthHeader";
import { EmailField } from "./forms/EmailField";
import { PasswordField } from "./forms/PasswordField";
import { TermsAgreement } from "./forms/TermsAgreement";
import { ErrorMessage } from "./forms/ErrorMessage";
import { SubmitButton } from "./forms/SubmitButton";
import { TermsModal } from "./modals/TermsModal";
import { AIDataModal } from "./modals/AIDataModal";

export function SignUpView() {
  // 폼 데이터 상태 통합
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreeTerms: false,
    agreeAI: false,
  });

  // 에러 상태 (이미 객체 형태)
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    terms?: string;
  }>({});

  // 모달 상태 통합
  const [modals, setModals] = useState({
    showTerms: false,
    showAI: false,
  });

  // React Query mutation 사용
  const signUpMutation = useSignUp();

  // 폼 데이터 업데이트 헬퍼 함수들
  const updateFormData = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateModals = (modal: keyof typeof modals, isOpen: boolean) => {
    setModals((prev) => ({ ...prev, [modal]: isOpen }));
  };

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "비밀번호는 영문과 숫자를 포함해 8자 이상 입력해주세요.";
    }

    // Validate terms
    if (!formData.agreeTerms || !formData.agreeAI) {
      newErrors.terms = "필수 약관에 동의해주세요.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // React Query mutation 실행
    signUpMutation.mutate({
      email: formData.email,
      password: formData.password,
      agreeTerms: formData.agreeTerms,
      agreeAI: formData.agreeAI,
    });
  };

  const isFormValid = Boolean(
    formData.email &&
      formData.password &&
      formData.agreeTerms &&
      formData.agreeAI
  );

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
          aria-busy={signUpMutation.isPending}
        >
          <EmailField
            value={formData.email}
            onChange={(value) => updateFormData("email", value)}
            placeholder="example@gmail.com"
            error={errors.email}
          />

          <PasswordField
            value={formData.password}
            onChange={(value) => {
              updateFormData("password", value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="영문+숫자 8자 이상 입력"
            error={errors.password}
          />

          <TermsAgreement
            agreeTerms={formData.agreeTerms}
            agreeAI={formData.agreeAI}
            onTermsChange={(checked) => {
              updateFormData("agreeTerms", checked);
              setErrors((prev) => ({ ...prev, terms: undefined }));
            }}
            onAIChange={(checked) => {
              updateFormData("agreeAI", checked);
              setErrors((prev) => ({ ...prev, terms: undefined }));
            }}
            onShowTerms={() => updateModals("showTerms", true)}
            onShowAI={() => updateModals("showAI", true)}
            error={errors.terms}
          />

          {signUpMutation.error && (
            <ErrorMessage message={signUpMutation.error.message} />
          )}

          <SubmitButton
            isLoading={signUpMutation.isPending}
            isValid={isFormValid}
            loadingText="가입 중..."
            defaultText="가입하고 시작하기"
          />

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

      <TermsModal
        isOpen={modals.showTerms}
        onClose={() => updateModals("showTerms", false)}
      />

      <AIDataModal
        isOpen={modals.showAI}
        onClose={() => updateModals("showAI", false)}
      />
    </div>
  );
}
