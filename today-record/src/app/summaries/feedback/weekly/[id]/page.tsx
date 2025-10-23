"use client";

import { WeeklyFeedbackView } from "@/components/WeeklyFeedbackView";
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
  const [summary, setSummary] = useState<PeriodSummary | null>(null);
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
          setSummary(foundSummary);
        } else {
          // 더미 데이터 생성 (실제로는 API 호출)
          const dummySummary = await generateDummySummary(resolvedParams.id);
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
    router.push("/summaries");
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

// 더미 데이터 생성 함수
async function generateDummySummary(id: string): Promise<PeriodSummary> {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const weekNumber = Math.ceil(
    ((currentDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
      new Date(year, 0, 1).getDay() +
      1) /
      7
  );
  const monthNumber = currentDate.getMonth() + 1;

  const generatedId = `${year}-w${weekNumber
    .toString()
    .padStart(2, "0")}-${crypto.randomUUID().slice(0, 8)}`;

  return {
    id: generatedId,
    type: "weekly",
    period: `${year}년 ${weekNumber}주차`,
    dateRange: `${year}년 ${weekNumber}주차`,
    weekNumber: weekNumber,
    year,
    week: `${year}-W${weekNumber.toString().padStart(2, "0")}`,
    totalEntries: Math.floor(Math.random() * 15) + 5,
    createdAt: new Date(),

    // 새로운 데이터 구조에 맞는 필드들
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

    // 기존 필드들 (호환성을 위해 유지)
    overview:
      "이번 주는 집중력과 생산성 측면에서 긍정적인 변화가 있었습니다. 새로운 루틴을 도입하면서 시간 관리가 개선되었고, 프로젝트 진행도가 향상되었습니다.",
    keyInsights: [
      "새로운 시간 관리 기법이 효과적이었습니다",
      "팀과의 소통이 프로젝트 성공에 중요했습니다",
      "짧은 휴식이 집중력 향상에 도움이 되었습니다",
    ],
    emotionalTrends:
      "안정적이고 긍정적인 감정 상태를 유지했습니다. 스트레스 관리가 잘 되었고, 성취감을 느끼는 순간들이 많았습니다.",
    growthAreas: [
      "더 체계적인 업무 계획 수립이 필요합니다",
      "스트레스 관리 기법을 더 다양화해야 합니다",
    ],
    highlights: [
      "중요한 프로젝트의 첫 번째 마일스톤을 달성했습니다",
      "팀원들과의 협업이 원활하게 진행되었습니다",
    ],
    nextSteps:
      "다음 주에는 더 체계적인 계획을 세우고, 우선순위를 명확히 하겠습니다.",
    summary: "이번 주는 집중력과 생산성 측면에서 긍정적인 변화가 있었습니다.",
    growth_area: "시간 관리와 우선순위 설정",
    dominant_keywords: ["집중력", "생산성", "루틴", "협업", "성취"],
    pattern_summary:
      "아침 루틴을 정착시키면서 하루의 시작이 더 체계적이 되었습니다. 업무 시간을 블록 단위로 나누어 집중력을 높였습니다.",
    trend_changes:
      "이전 주 대비 업무 효율성이 20% 향상되었고, 스트레스 지수는 감소했습니다. 팀과의 소통 빈도가 증가했습니다.",
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
    representative_sentence:
      "새로운 루틴을 통해 찾은 집중력이 이번 주의 가장 큰 성과였습니다.",
  };
}
