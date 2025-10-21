import {
  ArrowLeft,
  TrendingUp,
  Heart,
  Star,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";
import { useJournal } from "../app/providers";
import { useRouter } from "next/navigation";

export function SummaryView() {
  const { periodSummary } = useJournal();
  const router = useRouter();

  if (!periodSummary) {
    return null;
  }

  const handleBack = () => {
    router.push("/summaries");
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
          <Calendar className="w-5 h-5" style={{ color: "#6B7A6F" }} />
          <h1 style={{ color: "#333333", fontSize: "1.5rem" }}>
            {periodSummary.type === "weekly" ? "주간 요약" : "월간 요약"}
          </h1>
        </div>
        <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}>
          {periodSummary.period} · {periodSummary.dateRange}
        </p>
        <p
          style={{
            color: "#4E4B46",
            opacity: 0.6,
            marginTop: "0.25rem",
            fontSize: "0.85rem",
          }}
        >
          총 {periodSummary.totalEntries}개의 기록
        </p>
      </header>

      {/* Overview */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor:
            periodSummary.type === "weekly" ? "#A8BBA8" : "#6B7A6F",
          color: "white",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5" />
          <h2 style={{ fontSize: "1.1rem" }}>전체 요약</h2>
        </div>
        <p style={{ lineHeight: "1.6", opacity: 0.95, fontSize: "0.95rem" }}>
          {periodSummary.overview}
        </p>
      </div>

      {/* Key Insights */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor: "white",
          border: "1px solid #EFE9E3",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" style={{ color: "#D08C60" }} />
          <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
            핵심 인사이트
          </h2>
        </div>
        <ul className="space-y-3">
          {periodSummary.keyInsights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: "#D08C60" }}
              />
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                {insight}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Emotional Trends */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor: "#EFE9E3",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5" style={{ color: "#A3BFD9" }} />
          <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>감정 흐름</h2>
        </div>
        <p style={{ color: "#333333", lineHeight: "1.6", fontSize: "0.9rem" }}>
          {periodSummary.emotionalTrends}
        </p>
      </div>

      {/* Highlights */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor: "white",
          border: "1px solid #EFE9E3",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" style={{ color: "#A8BBA8" }} />
          <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
            이번 {periodSummary.type === "weekly" ? "주" : "달"}의 하이라이트
          </h2>
        </div>
        <div className="grid gap-2">
          {periodSummary.highlights.map((highlight, index) => (
            <div
              key={index}
              className="p-3 rounded-lg flex items-start gap-2"
              style={{ backgroundColor: "#FAFAF8" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: "#A8BBA8" }}
              />
              <p
                style={{
                  color: "#333333",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                }}
              >
                {highlight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Areas */}
      <div
        className="p-5 rounded-2xl mb-5"
        style={{
          backgroundColor: "white",
          border: "1px solid #EFE9E3",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: "#B1736C" }} />
          <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>성장 영역</h2>
        </div>
        <ul className="space-y-3">
          {periodSummary.growthAreas.map((area, index) => (
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
                {area}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Steps */}
      <div
        className="p-5 rounded-2xl mb-6"
        style={{
          backgroundColor: "#A3BFD9",
          color: "white",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5" />
          <h2 style={{ fontSize: "1.1rem" }}>
            다음 {periodSummary.type === "weekly" ? "주" : "달"}을 위한 제안
          </h2>
        </div>
        <p style={{ lineHeight: "1.6", opacity: 0.95, fontSize: "0.95rem" }}>
          {periodSummary.nextSteps}
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
