"use client";

import { DailyFeedbackView } from "@/components/DailyFeedbackView";
import { useJournal } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DailyFeedbackPayload } from "@/types/Entry";

export default function FeedbackPage() {
  const { fetchFeedback } = useJournal();
  const router = useRouter();
  const [feedback, setFeedback] = useState<DailyFeedbackPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split("T")[0];

      try {
        const data = await fetchFeedback(today);
        setFeedback(data);
      } catch (err) {
        setError(
          "피드백 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [fetchFeedback]);

  const handleBack = () => {
    router.push("/");
  };

  return (
    <DailyFeedbackView
      feedback={feedback}
      loading={loading}
      error={error}
      onBack={handleBack}
      showBackButton={true}
      title="오늘의 피드백"
      subtitle="AI가 분석한 일일 인사이트를 확인하세요"
    />
  );
}
