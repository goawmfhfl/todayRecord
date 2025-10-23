"use client";

import {
  MonthlyFeedbackView,
  MonthlySummaryCore,
} from "@/components/MonthlyFeedbackView";
import { useJournalStore } from "@/app/store/useJournalStore";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";

export default function MonthlyViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { summaries } = useJournalStore();
  const router = useRouter();
  const [summary, setSummary] = useState<MonthlySummaryCore | null>(null);
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
          // PeriodSummary를 MonthlySummaryCore로 변환
          const monthlySummary = convertToMonthlySummary(foundSummary);
          setSummary(monthlySummary);
        } else {
          // 더미 데이터 생성 (실제로는 API 호출)
          const dummySummary = await generateDummyMonthlySummary(
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

  return <MonthlyFeedbackView summary={summary} onBack={handleBack} />;
}

// PeriodSummary를 MonthlySummaryCore로 변환하는 함수
function convertToMonthlySummary(periodSummary: any): MonthlySummaryCore {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return {
    id: periodSummary.id,
    type: "monthly",
    period: periodSummary.month
      ? `${periodSummary.month.split("-")[0]}년 ${
          periodSummary.month.split("-")[1]
        }월`
      : `${year}년 ${month}월`,
    year: periodSummary.year || year,
    month: periodSummary.monthNumber || month,
    dateRange:
      periodSummary.dateRange ||
      `${year}-${month.toString().padStart(2, "0")}-01 ~ ${year}-${month
        .toString()
        .padStart(2, "0")}-31`,
    weeks: Math.ceil(periodSummary.totalEntries / 7) || 4,
    totalEntries: periodSummary.totalEntries || 0,
    momentum: Math.random() * 0.6 + 0.3, // 0.3 ~ 0.9
    trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "stable",
    overview:
      periodSummary.overview ||
      periodSummary.insight_summary ||
      "이번 달의 성장과 발전을 기록했습니다.",
    keyInsights: periodSummary.keyInsights || [
      "지속적인 학습이 성장의 핵심이었습니다",
      "규칙적인 운동이 에너지 레벨을 높였습니다",
      "독서 습관이 창의적 사고를 자극했습니다",
    ],
    themes: periodSummary.dominant_keywords || ["성장", "학습", "도전"],
    achievements: periodSummary.highlights || [
      "새로운 기술 스택을 성공적으로 학습했습니다",
      "개인 프로젝트에서 의미 있는 진전을 이루었습니다",
    ],
    growthAreas: periodSummary.growthAreas || [
      "장기적 목표 설정과 실행 계획이 필요합니다",
      "네트워킹과 인맥 관리에 더 집중해야 합니다",
    ],
    nextSteps: {
      focus: periodSummary.action_recommendation || [
        "매일의 실행을 시스템 단위로 자동화할 것",
        "루틴 점검일(주 1회)을 고정하여 회고 리듬 유지",
      ],
      experiments: ["새로운 학습 방법 시도", "생산성 도구 실험"],
    },
    generatedAt:
      periodSummary.createdAt?.toISOString() || new Date().toISOString(),
  };
}

// 더미 월간 데이터 생성 함수
async function generateDummyMonthlySummary(
  id: string
): Promise<MonthlySummaryCore> {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return {
    id: id,
    type: "monthly",
    period: `${year}년 ${month}월`,
    year,
    month,
    dateRange: `${year}-${month
      .toString()
      .padStart(2, "0")}-01 ~ ${year}-${month.toString().padStart(2, "0")}-31`,
    weeks: 4,
    totalEntries: Math.floor(Math.random() * 20) + 10,
    momentum: Math.random() * 0.6 + 0.3, // 0.3 ~ 0.9
    trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "stable",
    overview: "루틴 회복과 AI 질문 템플릿 도입으로 실행 탄력이 붙은 달.",
    keyInsights: [
      "오전 몰입 시간이 성과에 가장 크게 기여했다",
      "질문 템플릿 표준화가 개발 속도를 높였다",
      "작은 승리→빠른 피드백 루프가 동기 유지에 유효했다",
    ],
    themes: ["루틴", "집중", "AI활용"],
    achievements: [
      "반응형 메인 섹션 60% 구현",
      "AI 질문 템플릿 v1 도입",
      "클론코딩 구조 설계 마무리",
    ],
    growthAreas: ["오후 에너지 관리", "세부 일정 쪼개기", "운동 루틴 유지"],
    nextSteps: {
      focus: ["오전 골든타임 고정", "오후 리듬 설계", "질문 템플릿 v2"],
      experiments: ["오후 3시 15분 산책", "작업 전 4문장 체크리스트"],
    },
    generatedAt: new Date().toISOString(),
  };
}
