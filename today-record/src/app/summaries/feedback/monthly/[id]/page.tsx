"use client";

import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Hash,
  Target,
  Gauge,
  CheckCircle2,
  Quote,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PeriodSummary } from "@/types/Entry";
import { useRouter, useParams } from "next/navigation";
import { useJournalStore } from "@/app/store/useJournalStore";

export default function MonthlyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { summaries } = useJournalStore();

  // URL 파라미터에서 id를 가져와서 해당 summary를 찾기
  const id = params.id as string;
  const summary = summaries.find((s) => s.id === id);

  // summary가 없으면 더미 데이터 생성
  const finalSummary = summary || generateMonthlyDummySummary(id);

  const onBack = () => {
    router.push("/summaries");
  };

  return <MonthlyDetailView summary={finalSummary} onBack={onBack} />;
}

type MonthlyDetailViewProps = {
  summary: PeriodSummary;
  onBack: () => void;
};

function MonthlyDetailView({ summary, onBack }: MonthlyDetailViewProps) {
  console.log("MonthlyDetailView rendered with summary:", summary);

  // Parse satisfaction trend
  const getSatisfactionTrendValue = (
    trend: string | number | undefined
  ): { value: number; display: string } => {
    if (!trend) return { value: 0, display: "0%" };
    if (typeof trend === "string") {
      const match = trend.match(/([+-]?\d+)%/);
      if (match) {
        return { value: parseInt(match[1]), display: trend };
      }
      return { value: 0, display: trend };
    }
    return {
      value: Math.round(trend * 100),
      display: `${trend > 0 ? "+" : ""}${Math.round(trend * 100)}%`,
    };
  };

  const satisfactionTrend = getSatisfactionTrendValue(
    summary.growth_curve?.satisfaction_trend
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
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

        <div className="mb-4">
          <h1 className="mb-1" style={{ color: "#333333", fontSize: "1.5rem" }}>
            {summary.period} 월간 요약
          </h1>
          <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}>
            {summary.dateRange}
          </p>
        </div>

        {/* Representative Sentence Quote */}
        {summary.representative_sentence && (
          <div
            className="p-6 rounded-2xl relative mb-6"
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

        {/* Insight Summary */}
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
      </header>

      {/* Keyword Trend - 2 Columns */}
      {summary.keyword_trend &&
        (summary.keyword_trend.increased.length > 0 ||
          summary.keyword_trend.decreased.length > 0) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5" style={{ color: "#6B7A6F" }} />
              <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
                키워드 트렌드
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Increased Keywords */}
              {summary.keyword_trend.increased.length > 0 && (
                <Card
                  className="p-5"
                  style={{
                    backgroundColor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: "#3B82F6" }}
                    />
                    <h3 style={{ color: "#1E40AF", fontSize: "1rem" }}>
                      상승 키워드
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary.keyword_trend.increased.map((keyword, index) => (
                      <Badge
                        key={index}
                        className="rounded-full px-3 py-1.5"
                        style={{
                          backgroundColor: "#3B82F6",
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
              {summary.keyword_trend.decreased.length > 0 && (
                <Card
                  className="p-5"
                  style={{
                    backgroundColor: "#FEF3C7",
                    border: "1px solid #FDE68A",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown
                      className="w-5 h-5"
                      style={{ color: "#D97706" }}
                    />
                    <h3 style={{ color: "#92400E", fontSize: "1rem" }}>
                      감소 키워드
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary.keyword_trend.decreased.map((keyword, index) => (
                      <Badge
                        key={index}
                        className="rounded-full px-3 py-1.5"
                        style={{
                          backgroundColor: "#D97706",
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

      {/* Behavior Pattern */}
      {summary.behavior_pattern && (
        <Card
          className="p-6 mb-6"
          style={{
            backgroundColor: "white",
            border: "2px solid #A3BFD9",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5" style={{ color: "#A3BFD9" }} />
            <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>행동 패턴</h2>
          </div>
          <p style={{ color: "#333333", lineHeight: "1.8", fontSize: "1rem" }}>
            {summary.behavior_pattern}
          </p>
        </Card>
      )}

      {/* Growth Curve Metrics */}
      {summary.growth_curve && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5" style={{ color: "#6B7A6F" }} />
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
              <Progress
                value={summary.growth_curve.focus_score_avg * 10}
                className="h-2"
                style={{ backgroundColor: "#EFE9E3" }}
              />
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
                    backgroundColor:
                      satisfactionTrend.value >= 0 ? "#10B981" : "#EF4444",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                >
                  {satisfactionTrend.display}
                </Badge>
              </div>
              <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.8rem" }}>
                전월 대비 변화
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
              <Progress
                value={summary.growth_curve.consistency * 100}
                className="h-2"
                style={{ backgroundColor: "#EFE9E3" }}
              />
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

      {/* Action Recommendations */}
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

      {/* Weekly References */}
      {summary.weekly_refs && summary.weekly_refs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" style={{ color: "#6B7A6F" }} />
            <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
              주요 주차 참고
            </h2>
          </div>

          <div className="space-y-2">
            {summary.weekly_refs.map((ref, index) => (
              <Card
                key={index}
                className="p-3"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #EFE9E3",
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: "#6B7A6F", fontSize: "0.9rem" }}>
                    {ref.week}
                  </span>
                  {ref.note && (
                    <span
                      style={{
                        color: "#4E4B46",
                        opacity: 0.7,
                        fontSize: "0.85rem",
                      }}
                    >
                      {ref.note}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
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
          요약 목록으로 돌아가기
        </Button>
      </div>
    </div>
  );
}

// Monthly 전용 더미 데이터 생성 함수
function generateMonthlyDummySummary(id: string): PeriodSummary {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNumber = currentDate.getMonth() + 1;

  const generatedId = `${year}-m${monthNumber
    .toString()
    .padStart(2, "0")}-${crypto.randomUUID().slice(0, 8)}`;

  return {
    id: generatedId,
    type: "monthly",
    period: `${year}년 ${monthNumber}월`,
    dateRange: `${year}년 ${monthNumber}월`,
    monthNumber,
    year,
    month: `${year}-${monthNumber.toString().padStart(2, "0")}`,
    totalEntries: Math.floor(Math.random() * 30) + 15,
    createdAt: new Date(),

    // Monthly 전용 데이터 구조
    keyword_trend: {
      increased: ["AI활용", "실행력", "자기확신", "시스템화", "목표달성"],
      decreased: ["불안", "피로", "완벽주의", "지연"],
    },
    behavior_pattern: "기록과 운동 루틴이 완전히 습관화됨",
    growth_curve: {
      focus_score_avg: 8.2,
      satisfaction_trend: "+12%",
      consistency: 0.9,
    },
    insight_summary:
      "결과보다 과정에 집중하는 태도가 강화되며 자기확신이 뚜렷해졌다.",
    action_recommendation: [
      "매일의 실행을 시스템 단위로 자동화할 것",
      "루틴 점검일(주 1회)을 고정하여 회고 리듬 유지",
      "다음 달엔 '루틴 → 창의성' 단계로 확장",
    ],

    // 기존 필드들 (호환성을 위해 유지)
    overview:
      "이번 달은 전반적으로 성장과 발전의 시기였습니다. 새로운 기술을 학습하고, 팀워크를 강화하며, 개인적인 목표 달성에 집중했습니다.",
    keyInsights: [
      "지속적인 학습이 성장의 핵심이었습니다",
      "규칙적인 운동이 에너지 레벨을 높였습니다",
      "독서 습관이 창의적 사고를 자극했습니다",
    ],
    emotionalTrends:
      "월 초에는 약간의 불안감이 있었지만, 점차 자신감이 향상되었습니다. 새로운 도전에 대한 기대감이 높아졌습니다.",
    growthAreas: [
      "장기적 목표 설정과 실행 계획이 필요합니다",
      "네트워킹과 인맥 관리에 더 집중해야 합니다",
    ],
    highlights: [
      "새로운 기술 스택을 성공적으로 학습했습니다",
      "개인 프로젝트에서 의미 있는 진전을 이루었습니다",
    ],
    nextSteps:
      "다음 달에는 새로운 도전에 집중하고, 지속적인 성장을 추구하겠습니다.",
    summary: "이번 달은 전반적으로 성장과 발전의 시기였습니다.",
    insight_core: "지속적인 학습과 자기계발이 성장의 원동력이었습니다",
    growth_area: "장기적 목표 설정과 실행력",
    dominant_keywords: ["성장", "학습", "도전", "목표", "발전"],
    pattern_summary:
      "매일 일정한 시간을 학습에 할애하면서 지식이 체계적으로 쌓였습니다. 주말에는 새로운 경험을 통해 시야를 넓혔습니다.",
    trend_changes:
      "월 초 대비 자신감이 크게 향상되었고, 새로운 도전에 대한 두려움이 줄어들었습니다. 학습 속도가 빨라졌습니다.",
    strengths: [
      "목표 지향적 사고",
      "지속적인 자기계발",
      "적응력과 유연성",
      "긍정적인 마인드셋",
    ],
    weaknesses: [
      "장기 계획 수립의 어려움",
      "변화에 대한 두려움",
      "과도한 자기 비판",
    ],
    growth_direction: "학습 → 성장 → 도전 → 발전 → 성공",
    representative_sentence:
      "지속적인 학습과 도전을 통해 한 단계 성장할 수 있었던 의미 있는 한 달이었습니다.",
  };
}
