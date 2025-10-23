import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Award,
  Sprout,
  ArrowRight,
  Zap,
  Tag,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";

export type MonthlySummaryCore = {
  id: string;
  type: "monthly";
  period: string;
  year: number;
  month: number;
  dateRange: string;

  weeks: number;
  totalEntries: number;

  momentum: number; // 0~1
  trend: "up" | "down" | "stable";

  overview: string;
  keyInsights: string[];
  themes: string[];
  achievements: string[];
  growthAreas: string[];
  nextSteps: {
    focus: string[];
    experiments: string[];
  };
  generatedAt: string;
};

type MonthlySummaryPageProps = {
  summary: MonthlySummaryCore;
  onBack: () => void;
};

export const monthlyExample: MonthlySummaryCore = {
  id: "2025-10",
  type: "monthly",
  period: "2025년 10월",
  year: 2025,
  month: 10,
  dateRange: "2025-10-01 ~ 2025-10-31",

  weeks: 3,
  totalEntries: 15,

  momentum: 0.42,
  trend: "up",

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

export function MonthlyFeedbackView({
  summary,
  onBack,
}: MonthlySummaryPageProps) {
  const getTrendIcon = () => {
    if (summary.trend === "up") return <TrendingUp className="w-5 h-5" />;
    if (summary.trend === "down") return <TrendingDown className="w-5 h-5" />;
    return <BarChart3 className="w-5 h-5" />;
  };

  const getTrendColor = () => {
    if (summary.trend === "up") return "#A8BBA8"; // 세이지 그린
    if (summary.trend === "down") return "#D08C60"; // 테라코타
    return "#A3BFD9"; // 더스티 블루
  };

  const momentumPercentage = Math.round(summary.momentum * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 -ml-2 hover:bg-transparent"
        style={{ color: "#6B7A6F" }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        돌아가기
      </Button>

      {/* Header Card */}
      <div
        className="mb-6 p-6 sm:p-8 rounded-3xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #A8BBA8 0%, #A3BFD9 100%)",
          boxShadow: "0 4px 20px rgba(168, 187, 168, 0.15)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-white opacity-90" />
            <span
              className="text-white opacity-90"
              style={{ fontSize: "0.9rem" }}
            >
              {summary.dateRange}
            </span>
          </div>
          <h1 className="mb-2 text-white" style={{ fontSize: "2rem" }}>
            {summary.period}
          </h1>
          <p
            className="text-white opacity-95 mb-6"
            style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
          >
            {summary.overview}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* 기록 수 */}
            <div
              className="bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-30"
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                minHeight: "80px",
              }}
            >
              <div
                className="text-white opacity-90 mb-2 font-medium"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.025em",
                  color: "#6B7A6F",
                }}
              >
                기록 수
              </div>
              <div
                className="text-white font-bold"
                style={{
                  fontSize: "1.5rem",
                  lineHeight: "1.2",
                  color: "#6B7A6F",
                }}
              >
                {summary?.totalEntries || 0}
              </div>
            </div>

            {/* 주간 수 */}
            <div
              className="bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-30"
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                minHeight: "80px",
                color: "#6B7A6F",
              }}
            >
              <div
                className="text-white opacity-90 mb-2 font-medium"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.025em",
                  color: "#6B7A6F",
                }}
              >
                주간 수
              </div>
              <div
                className="text-white font-bold"
                style={{
                  fontSize: "1.5rem",
                  lineHeight: "1.2",
                  color: "#6B7A6F",
                }}
              >
                {summary?.weeks || 0}주
              </div>
            </div>

            {/* 추진력 */}
            <div
              className="bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-30"
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                minHeight: "80px",
                color: "#6B7A6F",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="text-white opacity-90 font-medium"
                  style={{
                    fontSize: "0.8rem",
                    letterSpacing: "0.025em",
                    color: "#6B7A6F",
                  }}
                >
                  추진력
                </div>
                <div
                  className="flex items-center"
                  style={{ color: getTrendColor() }}
                >
                  {getTrendIcon()}
                </div>
              </div>
              <div
                className="text-white font-bold"
                style={{
                  fontSize: "1.5rem",
                  lineHeight: "1.2",
                  color: "#6B7A6F",
                }}
              >
                {momentumPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-10"
          style={{
            background: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Momentum Progress Bar */}
      <div
        className="mb-8 p-5 rounded-2xl"
        style={{ backgroundColor: "white" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: "#A8BBA8" }} />
            <span style={{ color: "#333333", fontSize: "0.95rem" }}>
              이번 달 추진력
            </span>
          </div>
          <span style={{ color: getTrendColor(), fontSize: "0.9rem" }}>
            {summary.trend === "up"
              ? "상승세"
              : summary.trend === "down"
              ? "하락세"
              : "안정"}
          </span>
        </div>
        <div
          className="relative w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${momentumPercentage}%`,
              background: `linear-gradient(90deg, ${getTrendColor()} 0%, ${getTrendColor()}dd 100%)`,
            }}
          />
        </div>
      </div>

      {/* Key Insights */}
      {summary.keyInsights.length > 0 && (
        <div
          className="mb-6 p-6 rounded-2xl"
          style={{ backgroundColor: "#FFF9F0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5" style={{ color: "#D08C60" }} />
            <h2 style={{ color: "#333333", fontSize: "1.2rem" }}>
              핵심 인사이트
            </h2>
          </div>
          <div className="space-y-3">
            {summary.keyInsights.map((insight, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #F5E6D3",
                }}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#D08C60",
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                >
                  {index + 1}
                </div>
                <p
                  style={{
                    color: "#4E4B46",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {summary.themes.length > 0 && (
        <div
          className="mb-6 p-6 rounded-2xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5" style={{ color: "#A3BFD9" }} />
            <h2 style={{ color: "#333333", fontSize: "1.2rem" }}>주요 테마</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.themes.map((theme, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{
                  backgroundColor: "#EDF4F7",
                  color: "#4E7A8F",
                  fontSize: "0.9rem",
                  border: "1px solid #D1E5ED",
                }}
              >
                #{theme}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements & Growth Areas Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Achievements */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: "#F0F8F0" }}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5" style={{ color: "#A8BBA8" }} />
            <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
              성취한 것들
            </h2>
          </div>
          <div className="space-y-2">
            {summary.achievements.length > 0 ? (
              summary.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg transition-all hover:bg-white"
                  style={{ fontSize: "0.9rem" }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#A8BBA8" }}
                    />
                  </div>
                  <span style={{ color: "#4E4B46" }}>{achievement}</span>
                </div>
              ))
            ) : (
              <p
                style={{
                  color: "#4E4B46",
                  opacity: 0.5,
                  fontSize: "0.85rem",
                  padding: "1rem 0",
                }}
              >
                기록된 성취가 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Growth Areas */}
        <div className="p-6 rounded-2xl" style={{ backgroundColor: "#FEF6F0" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="w-5 h-5" style={{ color: "#D08C60" }} />
            <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>성장 영역</h2>
          </div>
          <div className="space-y-2">
            {summary.growthAreas.length > 0 ? (
              summary.growthAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg transition-all hover:bg-white"
                  style={{ fontSize: "0.9rem" }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#D08C60" }}
                    />
                  </div>
                  <span style={{ color: "#4E4B46" }}>{area}</span>
                </div>
              ))
            ) : (
              <p
                style={{
                  color: "#4E4B46",
                  opacity: 0.5,
                  fontSize: "0.85rem",
                  padding: "1rem 0",
                }}
              >
                기록된 성장 영역이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #F0F8F0 0%, #EDF4F7 100%)",
          border: "2px solid #A8BBA8",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5" style={{ color: "#6B7A6F" }} />
          <h2 style={{ color: "#333333", fontSize: "1.2rem" }}>다음 단계</h2>
        </div>

        <div className="space-y-5">
          {/* Focus */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-4 h-4" style={{ color: "#A8BBA8" }} />
              <h3 style={{ color: "#4E4B46", fontSize: "0.95rem" }}>
                집중할 것
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.nextSteps.focus.length > 0 ? (
                summary.nextSteps.focus.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: "white",
                      color: "#4E4B46",
                      fontSize: "0.85rem",
                      border: "1px solid #D1E5D1",
                    }}
                  >
                    {item}
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color: "#4E4B46",
                    opacity: 0.5,
                    fontSize: "0.85rem",
                  }}
                >
                  집중 항목이 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* Experiments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: "#D08C60" }} />
              <h3 style={{ color: "#4E4B46", fontSize: "0.95rem" }}>
                실험해볼 것
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.nextSteps.experiments.length > 0 ? (
                summary.nextSteps.experiments.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: "white",
                      color: "#4E4B46",
                      fontSize: "0.85rem",
                      border: "1px solid #F5E6D3",
                    }}
                  >
                    {item}
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color: "#4E4B46",
                    opacity: 0.5,
                    fontSize: "0.85rem",
                  }}
                >
                  실험 항목이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Date */}
      <div className="mt-6 text-center">
        <p style={{ color: "#4E4B46", opacity: 0.5, fontSize: "0.8rem" }}>
          생성일:{" "}
          {new Date(summary.generatedAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
