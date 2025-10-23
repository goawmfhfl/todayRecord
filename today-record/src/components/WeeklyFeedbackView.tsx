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

      {/* 2. Keyword Trend */}
      {summary.keyword_trend && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5" style={{ color: "#6B7A6F" }} />
            <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
              키워드 트렌드
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Increased Keywords */}
            {summary.keyword_trend.increased &&
              summary.keyword_trend.increased.length > 0 && (
                <Card
                  className="p-5"
                  style={{
                    backgroundColor: "#F0F7F0",
                    border: "1px solid #C8D5C8",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: "#7BA87B" }}
                    />
                    <h3 style={{ color: "#5A6B5A", fontSize: "1rem" }}>
                      상승 키워드
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary.keyword_trend.increased.map((keyword, index) => (
                      <Badge
                        key={index}
                        className="rounded-full px-3 py-1.5"
                        style={{
                          backgroundColor: "#7BA87B",
                          color: "white",
                          fontSize: "0.85rem",
                        }}
                      >
                        ▲ {keyword}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

            {/* Decreased Keywords */}
            {summary.keyword_trend.decreased &&
              summary.keyword_trend.decreased.length > 0 && (
                <Card
                  className="p-5"
                  style={{
                    backgroundColor: "#F7F3F0",
                    border: "1px solid #E5D5C8",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: "#B89A7A" }}
                    />
                    <h3 style={{ color: "#8B6F4F", fontSize: "1rem" }}>
                      감소 키워드
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary.keyword_trend.decreased.map((keyword, index) => (
                      <Badge
                        key={index}
                        className="rounded-full px-3 py-1.5"
                        style={{
                          backgroundColor: "#B89A7A",
                          color: "white",
                          fontSize: "0.85rem",
                        }}
                      >
                        ▼ {keyword}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
          </div>
        </div>
      )}

      {/* 3. Behavior Pattern */}
      {summary.behavior_pattern && (
        <Card
          className="p-6 mb-6"
          style={{
            backgroundColor: "white",
            border: "2px solid #A3BFD9",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5" style={{ color: "#A3BFD9" }} />
            <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>행동 패턴</h2>
          </div>
          <p style={{ color: "#333333", lineHeight: "1.8", fontSize: "1rem" }}>
            {summary.behavior_pattern}
          </p>
        </Card>
      )}

      {/* 4. Growth Curve Metrics */}
      {summary.growth_curve && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5" style={{ color: "#6B7A6F" }} />
            <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>성장 곡선</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Focus Score */}
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ color: "#333333", fontSize: "0.95rem" }}>
                  평균 집중도
                </h3>
                <span style={{ color: "#A8BBA8", fontSize: "1.5rem" }}>
                  {summary.growth_curve.focus_score_avg.toFixed(1)}
                </span>
              </div>
              <div
                className="w-full bg-gray-200 rounded-full h-2"
                style={{ backgroundColor: "#EFE9E3" }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: "#A8BBA8",
                    width: `${summary.growth_curve.focus_score_avg * 10}%`,
                  }}
                />
              </div>
              <p
                style={{
                  color: "#4E4B46",
                  opacity: 0.7,
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                }}
              >
                10점 만점 기준
              </p>
            </Card>

            {/* Satisfaction Trend */}
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 style={{ color: "#333333", fontSize: "0.95rem" }}>
                  만족도 추세
                </h3>
                <Badge
                  className="rounded-full px-3 py-1"
                  style={{
                    backgroundColor: String(
                      summary.growth_curve.satisfaction_trend
                    ).startsWith("+")
                      ? "#10B981"
                      : "#EF4444",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                >
                  {summary.growth_curve.satisfaction_trend}
                </Badge>
              </div>
              <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.8rem" }}>
                전{summary.type === "weekly" ? "주" : "월"} 대비 변화
              </p>
            </Card>

            {/* Consistency */}
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ color: "#333333", fontSize: "0.95rem" }}>
                  일관성
                </h3>
                <span style={{ color: "#D08C60", fontSize: "1.5rem" }}>
                  {Math.round(summary.growth_curve.consistency * 100)}%
                </span>
              </div>
              <div
                className="w-full bg-gray-200 rounded-full h-2"
                style={{ backgroundColor: "#EFE9E3" }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: "#D08C60",
                    width: `${summary.growth_curve.consistency * 100}%`,
                  }}
                />
              </div>
              <p
                style={{
                  color: "#4E4B46",
                  opacity: 0.7,
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                }}
              >
                루틴 안정화 지수
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* 5. Insight Summary */}
      {summary.insight_summary && (
        <div
          className="p-5 rounded-xl mb-6"
          style={{
            backgroundColor: "#A8BBA8",
            color: "white",
          }}
        >
          <h2 className="mb-2" style={{ fontSize: "0.95rem", opacity: 0.9 }}>
            핵심 인사이트
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            {summary.insight_summary}
          </p>
        </div>
      )}

      {/* 6. Action Recommendations */}
      {summary.action_recommendation &&
        summary.action_recommendation.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5" style={{ color: "#6B7A6F" }} />
              <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
                실행 제안
              </h2>
            </div>

            <div className="space-y-3">
              {summary.action_recommendation.map((action, index) => (
                <Card
                  key={index}
                  className="p-4"
                  style={{
                    backgroundColor: "#FAFAF8",
                    border: "1px solid #EFE9E3",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: "#A8BBA8",
                        color: "white",
                        fontSize: "0.8rem",
                      }}
                    >
                      {index + 1}
                    </div>
                    <p
                      style={{
                        color: "#333333",
                        lineHeight: "1.7",
                        fontSize: "0.95rem",
                        flex: 1,
                      }}
                    >
                      {action}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      {/* 7. Strengths & Weaknesses Analysis */}
      {(summary.strengths || summary.weaknesses) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Strengths */}
          {summary.strengths && summary.strengths.length > 0 && (
            <Card
              className="p-5"
              style={{
                backgroundColor: "#F0F7F0",
                border: "1px solid #C8D5C8",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: "#7BA87B" }}
                />
                <h3 style={{ color: "#5A6B5A", fontSize: "1rem" }}>강점</h3>
              </div>
              <ul className="space-y-2.5">
                {summary.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#7BA87B" }}
                    />
                    <p
                      style={{
                        color: "#5A6B5A",
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
                backgroundColor: "#F7F3F0",
                border: "1px solid #E5D5C8",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" style={{ color: "#B89A7A" }} />
                <h3 style={{ color: "#8B6F4F", fontSize: "1rem" }}>약점</h3>
              </div>
              <ul className="space-y-2.5">
                {summary.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#B89A7A" }}
                    />
                    <p
                      style={{
                        color: "#8B6F4F",
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
