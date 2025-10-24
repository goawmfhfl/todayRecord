"use client";

import { AlertCircle } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface TermsAgreementProps {
  agreeTerms: boolean;
  agreeAI: boolean;
  onTermsChange: (checked: boolean) => void;
  onAIChange: (checked: boolean) => void;
  onShowTerms: () => void;
  onShowAI: () => void;
  error?: string;
}

export function TermsAgreement({
  agreeTerms,
  agreeAI,
  onTermsChange,
  onAIChange,
  onShowTerms,
  onShowAI,
  error,
}: TermsAgreementProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={agreeTerms}
          onCheckedChange={(checked) => onTermsChange(checked === true)}
          className="mt-0.5"
        />
        <label
          htmlFor="terms"
          className="flex-1 cursor-pointer"
          style={{ color: "#333333", fontSize: "0.9rem" }}
        >
          <span style={{ color: "#EF4444" }}>[필수]</span> 이용약관 및 개인정보
          수집·이용 동의{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onShowTerms();
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
          onCheckedChange={(checked) => onAIChange(checked === true)}
          className="mt-0.5"
        />
        <label
          htmlFor="ai"
          className="flex-1 cursor-pointer"
          style={{ color: "#333333", fontSize: "0.9rem" }}
        >
          <span style={{ color: "#EF4444" }}>[필수]</span> AI 피드백 데이터 학습
          활용 동의{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onShowAI();
            }}
            className="underline"
            style={{ color: "#6B7A6F" }}
          >
            (보기)
          </button>
        </label>
      </div>

      {error && (
        <p
          className="flex items-center gap-1"
          style={{ color: "#EF4444", fontSize: "0.8rem" }}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
