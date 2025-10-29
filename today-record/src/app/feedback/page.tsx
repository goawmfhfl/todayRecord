"use client";

import { DailyFeedbackView } from "@/components/DailyFeedbackView";
import { useRouter } from "next/navigation";
import { useDailyFeedback } from "@/hooks/useDailyFeedback";

export default function FeedbackPage() {
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const {
    data: feedback,
    isLoading: loading,
    error: queryError,
  } = useDailyFeedback(today);

  const error = queryError
    ? "피드백 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요."
    : null;

  const handleBack = () => {
    router.push("/");
  };

  return (
    <DailyFeedbackView
      feedback={feedback ?? null}
      loading={loading}
      error={error}
      onBack={handleBack}
      showBackButton={true}
      title="오늘의 피드백"
      subtitle="AI가 분석한 일일 인사이트를 확인하세요"
    />
  );
}
