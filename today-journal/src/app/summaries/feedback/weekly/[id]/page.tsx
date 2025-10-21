"use client";

import { WeeklyFeedbackView } from "@/components/WeeklyFeedbackView";
import { useJournalStore } from "@/app/store/useJournalStore";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import type { PeriodSummary } from "@/types/Entry";

export default function SummaryDetailPage({
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
        setLoading(true);
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
      } finally {
        setLoading(false);
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
  // 실제로는 API 호출을 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const isWeekly = id.includes("weekly") || Math.random() > 0.5;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const weekNumber = Math.ceil(
    ((currentDate.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
      new Date(year, 0, 1).getDay() +
      1) /
      7
  );
  const monthNumber = currentDate.getMonth() + 1;

  const generatedId = isWeekly
    ? `${year}-w${weekNumber.toString().padStart(2, "0")}-${crypto
        .randomUUID()
        .slice(0, 8)}`
    : `${year}-m${monthNumber.toString().padStart(2, "0")}-${crypto
        .randomUUID()
        .slice(0, 8)}`;

  return {
    id: generatedId,
    type: isWeekly ? "weekly" : "monthly",
    period: isWeekly
      ? `${year}년 ${weekNumber}주차`
      : `${year}년 ${monthNumber}월`,
    dateRange: isWeekly
      ? `${year}년 ${weekNumber}주차`
      : `${year}년 ${monthNumber}월`,
    weekNumber: isWeekly ? weekNumber : undefined,
    monthNumber: isWeekly ? undefined : monthNumber,
    year,
    week: isWeekly
      ? `${year}-W${weekNumber.toString().padStart(2, "0")}`
      : undefined,
    month: isWeekly
      ? undefined
      : `${year}-${monthNumber.toString().padStart(2, "0")}`,
    totalEntries: Math.floor(Math.random() * 15) + 5,
    overview: isWeekly
      ? "이번 주는 집중력과 생산성 측면에서 긍정적인 변화가 있었습니다. 새로운 루틴을 도입하면서 시간 관리가 개선되었고, 프로젝트 진행도가 향상되었습니다."
      : "이번 달은 전반적으로 성장과 발전의 시기였습니다. 새로운 기술을 학습하고, 팀워크를 강화하며, 개인적인 목표 달성에 집중했습니다.",
    keyInsights: [
      isWeekly
        ? "새로운 시간 관리 기법이 효과적이었습니다"
        : "지속적인 학습이 성장의 핵심이었습니다",
      isWeekly
        ? "팀과의 소통이 프로젝트 성공에 중요했습니다"
        : "규칙적인 운동이 에너지 레벨을 높였습니다",
      isWeekly
        ? "짧은 휴식이 집중력 향상에 도움이 되었습니다"
        : "독서 습관이 창의적 사고를 자극했습니다",
    ],
    emotionalTrends: isWeekly
      ? "안정적이고 긍정적인 감정 상태를 유지했습니다. 스트레스 관리가 잘 되었고, 성취감을 느끼는 순간들이 많았습니다."
      : "월 초에는 약간의 불안감이 있었지만, 점차 자신감이 향상되었습니다. 새로운 도전에 대한 기대감이 높아졌습니다.",
    growthAreas: [
      isWeekly
        ? "더 체계적인 업무 계획 수립이 필요합니다"
        : "장기적 목표 설정과 실행 계획이 필요합니다",
      isWeekly
        ? "스트레스 관리 기법을 더 다양화해야 합니다"
        : "네트워킹과 인맥 관리에 더 집중해야 합니다",
    ],
    highlights: [
      isWeekly
        ? "중요한 프로젝트의 첫 번째 마일스톤을 달성했습니다"
        : "새로운 기술 스택을 성공적으로 학습했습니다",
      isWeekly
        ? "팀원들과의 협업이 원활하게 진행되었습니다"
        : "개인 프로젝트에서 의미 있는 진전을 이루었습니다",
    ],
    nextSteps: isWeekly
      ? "다음 주에는 더 체계적인 계획을 세우고, 우선순위를 명확히 하겠습니다."
      : "다음 달에는 새로운 도전에 집중하고, 지속적인 성장을 추구하겠습니다.",
    createdAt: new Date(),
    // 추가 필드들
    summary: isWeekly
      ? "이번 주는 집중력과 생산성 측면에서 긍정적인 변화가 있었습니다."
      : "이번 달은 전반적으로 성장과 발전의 시기였습니다.",
    insight_core: isWeekly
      ? "새로운 루틴의 도입이 생산성 향상의 핵심이었습니다"
      : "지속적인 학습과 자기계발이 성장의 원동력이었습니다",
    growth_area: isWeekly
      ? "시간 관리와 우선순위 설정"
      : "장기적 목표 설정과 실행력",
    dominant_keywords: isWeekly
      ? ["집중력", "생산성", "루틴", "협업", "성취"]
      : ["성장", "학습", "도전", "목표", "발전"],
    pattern_summary: isWeekly
      ? "아침 루틴을 정착시키면서 하루의 시작이 더 체계적이 되었습니다. 업무 시간을 블록 단위로 나누어 집중력을 높였습니다."
      : "매일 일정한 시간을 학습에 할애하면서 지식이 체계적으로 쌓였습니다. 주말에는 새로운 경험을 통해 시야를 넓혔습니다.",
    trend_changes: isWeekly
      ? "이전 주 대비 업무 효율성이 20% 향상되었고, 스트레스 지수는 감소했습니다. 팀과의 소통 빈도가 증가했습니다."
      : "월 초 대비 자신감이 크게 향상되었고, 새로운 도전에 대한 두려움이 줄어들었습니다. 학습 속도가 빨라졌습니다.",
    strengths: isWeekly
      ? [
          "체계적인 시간 관리 능력",
          "팀워크와 협업 능력",
          "문제 해결을 위한 창의적 사고",
          "지속적인 학습 의지",
        ]
      : [
          "목표 지향적 사고",
          "지속적인 자기계발",
          "적응력과 유연성",
          "긍정적인 마인드셋",
        ],
    weaknesses: isWeekly
      ? [
          "완벽주의 성향으로 인한 스트레스",
          "우선순위 설정의 어려움",
          "거절하기 어려운 성격",
        ]
      : ["장기 계획 수립의 어려움", "변화에 대한 두려움", "과도한 자기 비판"],
    growth_direction: isWeekly
      ? "집중력 향상 → 생산성 증대 → 목표 달성 → 성취감 증진"
      : "학습 → 성장 → 도전 → 발전 → 성공",
    representative_sentence: isWeekly
      ? "새로운 루틴을 통해 찾은 집중력이 이번 주의 가장 큰 성과였습니다."
      : "지속적인 학습과 도전을 통해 한 단계 성장할 수 있었던 의미 있는 한 달이었습니다.",
  };
}
