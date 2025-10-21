"use client";

import { useJournal } from "../app/providers";
import { useRouter } from "next/navigation";

export function DayDetailView() {
  const { selectedDate, entries, dailyFeedbackMap, generateFeedback } =
    useJournal();
  const router = useRouter();

  if (!selectedDate) {
    return null;
  }

  const handleBack = () => {
    router.push("/logs");
  };

  const handleGenerateFeedback = () => {
    generateFeedback(selectedDate);
  };

  const dateKey = selectedDate.toISOString().split("T")[0];
  const dayEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    const entryDateStr = entryDate.toISOString().split("T")[0];
    return entryDateStr === dateKey;
  });
  const feedback = dailyFeedbackMap.get(dateKey);
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={handleBack} className="mb-4 underline">
        뒤로가기
      </button>
      <h2 className="text-xl font-semibold mb-2">
        {selectedDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h2>
      <ul className="space-y-2 mb-6">
        {dayEntries.map((e) => (
          <li key={e.id} className="rounded border p-3">
            <div className="text-xs opacity-70 mb-1">{e.type}</div>
            <div>{e.content}</div>
          </li>
        ))}
      </ul>
      {feedback ? (
        <div className="rounded border p-3">
          <div className="font-semibold mb-2">피드백</div>
          <div className="mb-2">{feedback.summary}</div>
          <div className="text-sm opacity-70">{feedback.recommendation}</div>
        </div>
      ) : (
        <button className="underline" onClick={handleGenerateFeedback}>
          이 날짜 피드백 생성
        </button>
      )}
    </div>
  );
}
