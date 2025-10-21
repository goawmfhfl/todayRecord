"use client";

import { ArrowLeft, Star, TrendingUp, Heart, Target } from "lucide-react";
import { Button } from "./ui/button";
import { useJournal } from "../app/providers";
import { useRouter } from "next/navigation";

export function FeedbackView() {
  const { currentDailyFeedback } = useJournal();
  const router = useRouter();

  if (!currentDailyFeedback) {
    return null;
  }

  const handleBack = () => {
    router.push("/");
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <header className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-3 -ml-2"
          style={{ color: "#6B7A6F" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5" style={{ color: "#6B7A6F" }} />
          <h1 style={{ color: "#333333", fontSize: "1.5rem" }}>
            오늘의 피드백
          </h1>
        </div>
        <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}>
          {currentDailyFeedback.date}
        </p>
      </header>

      {/* Summary */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor: "#A8BBA8",
          color: "white",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5" />
          <h2 style={{ fontSize: "1.1rem" }}>오늘의 요약</h2>
        </div>
        <p style={{ lineHeight: "1.6", opacity: 0.95, fontSize: "0.95rem" }}>
          {currentDailyFeedback.summary}
        </p>
      </div>

      {/* Strengths */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor: "white",
          border: "1px solid #EFE9E3",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" style={{ color: "#A8BBA8" }} />
          <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>오늘의 강점</h2>
        </div>
        <ul className="space-y-3">
          {currentDailyFeedback.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: "#A8BBA8" }}
              />
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                {strength}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor: "#EFE9E3",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: "#B1736C" }} />
          <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>개선할 점</h2>
        </div>
        <ul className="space-y-3">
          {currentDailyFeedback.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: "#B1736C" }}
              />
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                {improvement}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div
        className="p-5 rounded-2xl mb-6"
        style={{
          backgroundColor: "#A3BFD9",
          color: "white",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5" />
          <h2 style={{ fontSize: "1.1rem" }}>내일을 위한 제안</h2>
        </div>
        <p style={{ lineHeight: "1.6", opacity: 0.95, fontSize: "0.95rem" }}>
          {currentDailyFeedback.recommendation}
        </p>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleBack}
          className="rounded-full"
          style={{
            backgroundColor: "#6B7A6F",
            color: "white",
            padding: "0.875rem 2rem",
            fontSize: "0.9rem",
          }}
        >
          기록으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
