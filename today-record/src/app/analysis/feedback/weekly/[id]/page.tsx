"use client";

import {
  WeeklyFeedbackView,
  WeeklySummaryCore,
} from "@/components/WeeklyFeedbackView";
import { useJournalStore } from "@/app/store/useJournalStore";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import type { PeriodSummary } from "@/types/Entry";

export default function WeeklyViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { summaries } = useJournalStore();
  const router = useRouter();
  const [summary, setSummary] = useState<WeeklySummaryCore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // React.use()를 사용해서 params Promise를 unwrap
  const resolvedParams = use(params);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(false); // 로딩 상태를 바로 false로 설정
        setError(null);

        // 실제 데이터에서 찾기
        const foundSummary = summaries.find((s) => s.id === resolvedParams.id);

        if (foundSummary) {
          // PeriodSummary를 WeeklySummaryCore로 변환
          const weeklySummary = convertToWeeklySummary(foundSummary);
          setSummary(weeklySummary);
        } else {
          // 더미 데이터 생성 (실제로는 API 호출)
          const dummySummary = await generateDummyWeeklySummary(
            resolvedParams.id
          );
          setSummary(dummySummary);
        }
      } catch (err) {
        setError("요약 데이터를 불러오지 못했습니다.");
        console.error("Error loading summary:", err);
      }
    };

    loadSummary();
  }, [resolvedParams.id, summaries]);

  const handleBack = () => {
    router.push("/analysis");
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-16">
          <div className="animate-pulse">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "#EFE9E3" }}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: "#6B7A6F" }}
              />
            </div>
            <p style={{ color: "#4E4B46", fontSize: "0.95rem" }}>
              요약을 불러오는 중…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: "#FCA5A5" }}
            />
          </div>
          <p
            style={{
              color: "#991B1B",
              fontSize: "0.95rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "#6B7A6F",
              color: "white",
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!summary) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-16">
          <p style={{ color: "#4E4B46", fontSize: "0.95rem" }}>
            요약 데이터를 찾을 수 없습니다.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg text-sm mt-4"
            style={{
              backgroundColor: "#6B7A6F",
              color: "white",
            }}
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return <WeeklyFeedbackView summary={summary} onBack={handleBack} />;
}

// PeriodSummary를 WeeklySummaryCore로 변환하는 함수
function convertToWeeklySummary(
  periodSummary: PeriodSummary
): WeeklySummaryCore {
  return {
    id: periodSummary.id,
    type: "weekly",
    period: periodSummary.period,
    dateRange: periodSummary.dateRange,
    week: periodSummary.week,
    month: periodSummary.month,
    representative_sentence: periodSummary.representative_sentence,
    keyword_trend: periodSummary.keyword_trend,
    behavior_pattern: periodSummary.behavior_pattern,
    growth_curve: periodSummary.growth_curve,
    insight_summary: periodSummary.insight_summary,
    action_recommendation: periodSummary.action_recommendation,
    strengths: periodSummary.strengths,
    weaknesses: periodSummary.weaknesses,
    growth_direction: periodSummary.growth_direction,
  };
}

// 더미 주간 데이터 생성 함수
async function generateDummyWeeklySummary(
  id: string
): Promise<WeeklySummaryCore> {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const weekNumber = Math.ceil(
    ((currentDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
      new Date(year, 0, 1).getDay() +
      1) /
      7
  );

  return {
    id: id,
    type: "weekly",
    period: `${year}년 ${weekNumber}주차`,
    dateRange: `${year}년 ${weekNumber}주차`,
    week: `${year}-W${weekNumber.toString().padStart(2, "0")}`,
    representative_sentence:
      "새로운 루틴을 통해 찾은 집중력이 이번 주의 가장 큰 성과였습니다.",
    keyword_trend: {
      increased: ["집중력", "루틴", "협업", "성취"],
      decreased: ["불안", "피로", "완벽주의"],
    },
    behavior_pattern:
      "아침 루틴을 정착시키면서 하루의 시작이 더 체계적이 되었습니다",
    growth_curve: {
      focus_score_avg: 7.5,
      satisfaction_trend: "+8%",
      consistency: 0.75,
    },
    insight_summary: "새로운 루틴의 도입이 생산성 향상의 핵심이었습니다",
    action_recommendation: [
      "다음 주에는 더 체계적인 계획을 세우고 우선순위를 명확히 할 것",
      "짧은 휴식 시간을 더 규칙적으로 활용할 것",
      "팀과의 소통 빈도를 유지하면서 협업 효율성 높이기",
    ],
    strengths: [
      "체계적인 시간 관리 능력",
      "팀워크와 협업 능력",
      "문제 해결을 위한 창의적 사고",
      "지속적인 학습 의지",
    ],
    weaknesses: [
      "완벽주의 성향으로 인한 스트레스",
      "우선순위 설정의 어려움",
      "거절하기 어려운 성격",
    ],
    growth_direction: "집중력 향상 → 생산성 증대 → 목표 달성 → 성취감 증진",
  };
}
