import {
  ArrowLeft,
  TrendingUp,
  Hash,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Quote,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import type { PeriodSummary } from "@/types/Entry";

type WeeklyFeedbackViewProps = {
  summary: PeriodSummary;
  onBack: () => void;
};

export function WeeklyFeedbackView({
  summary,
  onBack,
}: WeeklyFeedbackViewProps) {
  console.log("WeeklyFeedbackView rendered with summary:", summary);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* 1. Header with Representative Sentence */}
      <header className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2"
          style={{ color: "#6B7A6F" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <h1 className="mb-1" style={{ color: "#333333", fontSize: "1.5rem" }}>
          {summary.week
            ? `${summary.week.split("-W")[0]}년 ${
                summary.week.split("-W")[1]
              }주차 요약`
            : summary.month
            ? `${summary.month.split("-")[0]}년 ${
                summary.month.split("-")[1]
              }월 요약`
            : summary.type === "weekly"
            ? "주간 요약"
            : "월간 요약"}
        </h1>
        <p
          className="mb-6"
          style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}
        >
          {summary.period} · {summary.dateRange}
        </p>

        {/* Representative Sentence Quote */}
        {summary.representative_sentence && (
          <div
            className="p-6 rounded-2xl relative"
            style={{
              backgroundColor: "#F5F3F0",
              border: "2px solid #6B7A6F",
            }}
          >
            <Quote
              className="absolute top-4 left-4 w-8 h-8"
              style={{ color: "#6B7A6F", opacity: 0.15 }}
            />
            <p
              className="text-center italic relative z-10"
              style={{
                color: "#333333",
                lineHeight: "1.8",
                fontSize: "1.05rem",
                paddingTop: "0.5rem",
              }}
            >
              "{summary.representative_sentence}"
            </p>
          </div>
        )}
      </header>

      {/* 2. Dominant Keywords */}
      {summary.dominant_keywords && summary.dominant_keywords.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-5 h-5" style={{ color: "#6B7A6F" }} />
            <h2 style={{ color: "#333333", fontSize: "1.05rem" }}>
              핵심 키워드
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.dominant_keywords.map((keyword, index) => (
              <Badge
                key={index}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: "#A8BBA8",
                  color: "white",
                  fontSize: "0.9rem",
                }}
              >
                #{keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 3. Pattern & Trend Changes Section */}
      {(summary.pattern_summary || summary.trend_changes) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Pattern Summary */}
          {summary.pattern_summary && (
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5" style={{ color: "#A3BFD9" }} />
                <h3 style={{ color: "#333333", fontSize: "1rem" }}>
                  행동 패턴
                </h3>
              </div>
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.7",
                  fontSize: "0.9rem",
                }}
              >
                {summary.pattern_summary}
              </p>
            </Card>
          )}

          {/* Trend Changes */}
          {summary.trend_changes && (
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-5 h-5" style={{ color: "#D08C60" }} />
                <h3 style={{ color: "#333333", fontSize: "1rem" }}>
                  트렌드 변화
                </h3>
              </div>
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.7",
                  fontSize: "0.9rem",
                }}
              >
                {summary.trend_changes}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* 4. Strengths & Weaknesses Analysis */}
      {(summary.strengths || summary.weaknesses) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Strengths */}
          {summary.strengths && summary.strengths.length > 0 && (
            <Card
              className="p-5"
              style={{
                backgroundColor: "#EFF6FF",
                border: "1px solid #BFDBFE",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: "#3B82F6" }}
                />
                <h3 style={{ color: "#1E40AF", fontSize: "1rem" }}>강점</h3>
              </div>
              <ul className="space-y-2.5">
                {summary.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#3B82F6" }}
                    />
                    <p
                      style={{
                        color: "#1E3A8A",
                        lineHeight: "1.6",
                        fontSize: "0.875rem",
                      }}
                    >
                      {strength}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Weaknesses */}
          {summary.weaknesses && summary.weaknesses.length > 0 && (
            <Card
              className="p-5"
              style={{
                backgroundColor: "#FFF7ED",
                border: "1px solid #FED7AA",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" style={{ color: "#F97316" }} />
                <h3 style={{ color: "#9A3412", fontSize: "1rem" }}>약점</h3>
              </div>
              <ul className="space-y-2.5">
                {summary.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#F97316" }}
                    />
                    <p
                      style={{
                        color: "#9A3412",
                        lineHeight: "1.6",
                        fontSize: "0.875rem",
                      }}
                    >
                      {weakness}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* 5. Growth Direction with Arrow Flow */}
      {summary.growth_direction && (
        <Card
          className="p-6 mb-6"
          style={{
            backgroundColor: "#A8BBA8",
            color: "white",
            border: "none",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5" />
            <h2 style={{ fontSize: "1.05rem" }}>성장 방향</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            {summary.growth_direction.includes("→") ? (
              // If the text contains arrows, split and display with visual arrows
              summary.growth_direction.split("→").map((part, index, array) => (
                <div key={index} className="flex items-center gap-3">
                  <span
                    className="px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {part.trim()}
                  </span>
                  {index < array.length - 1 && (
                    <ArrowRight className="w-6 h-6" style={{ opacity: 0.9 }} />
                  )}
                </div>
              ))
            ) : (
              // Otherwise display as is
              <p
                className="text-center"
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  opacity: 0.95,
                }}
              >
                {summary.growth_direction}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* 6. Bottom Quote Section */}
      {summary.representative_sentence && (
        <div
          className="p-5 rounded-2xl mb-6"
          style={{
            backgroundColor: "#EFE9E3",
          }}
        >
          <div className="flex items-start gap-3">
            <Quote
              className="w-6 h-6 flex-shrink-0 mt-1"
              style={{ color: "#6B7A6F" }}
            />
            <div>
              <p
                className="mb-2"
                style={{ color: "#6B7A6F", fontSize: "0.85rem" }}
              >
                이번 {summary.type === "weekly" ? "주" : "달"}의 인사이트
              </p>
              <p
                className="italic"
                style={{
                  color: "#333333",
                  lineHeight: "1.7",
                  fontSize: "0.95rem",
                }}
              >
                "{summary.representative_sentence}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={onBack}
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
