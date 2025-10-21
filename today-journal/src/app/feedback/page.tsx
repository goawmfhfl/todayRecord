"use client";

import { DailyFeedbackView } from "@/components/DailyFeedbackView";
import { useJournal } from "@/app/providers";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const { fetchFeedback } = useJournal();
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <DailyFeedbackView onBack={handleBack} onFetchFeedback={fetchFeedback} />
  );
}
