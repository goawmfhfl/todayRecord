import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Lightbulb,
  Eye,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Target,
  Hash,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { LoadingState } from "./ui/loading-state";
import { DailyFeedbackPayload } from "../types/Entry";

type DailyFeedbackViewProps = {
  feedback: DailyFeedbackPayload | null;
  loading?: boolean;
  error?: string | null;
  onBack: () => void;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
};

type LoadingState = "loading" | "success" | "error" | "empty";

export function DailyFeedbackView({
  feedback,
  loading = false,
  error = null,
  onBack,
  showBackButton = true,
  title = "오늘의 피드백",
  subtitle = "AI가 분석한 일일 인사이트를 확인하세요",
}: DailyFeedbackViewProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  useEffect(() => {
    if (loading) {
      setLoadingState("loading");
    } else if (error) {
      setLoadingState("error");
    } else if (!feedback || Object.keys(feedback).length === 0) {
      setLoadingState("empty");
    } else {
      setLoadingState("success");
    }
  }, [loading, error, feedback]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch {
      return dateStr;
    }
  };

  const clampScore = (score: number) => {
    return Math.max(0, Math.min(10, score));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <header className="mb-6">
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-3 -ml-2"
            style={{ color: "#6B7A6F" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        )}
        <h1 className="mb-1" style={{ color: "#333333", fontSize: "1.5rem" }}>
          {title}
        </h1>
        <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}>
          {subtitle}
        </p>
      </header>

      {/* Loading/Error/Empty State */}
      {loadingState !== "success" && (
        <LoadingState
          state={loadingState}
          error={error}
          onBack={onBack}
          loadingMessage="피드백을 불러오는 중…"
          emptyMessage="오늘 데이터가 없습니다"
          emptySubMessage="일상 기록을 먼저 작성해주세요"
        />
      )}

      {/* Success State - Display Feedback */}
      {loadingState === "success" && feedback && (
        <div className="space-y-5">
          {/* Date */}
          <div
            className="text-center pb-2"
            style={{ borderBottom: "1px solid #EFE9E3" }}
          >
            <p style={{ color: "#6B7A6F", fontSize: "0.9rem" }}>
              {formatDate(feedback.date)}
            </p>
          </div>

          {/* 1. Lesson */}
          {feedback.lesson && (
            <Card
              className="p-5"
              style={{
                backgroundColor: "#A8BBA8",
                color: "white",
                border: "none",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5" />
                <h2 style={{ fontSize: "1.05rem" }}>오늘의 한 줄 교훈</h2>
              </div>
              <p
                style={{
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                  opacity: 0.95,
                }}
              >
                {feedback.lesson}
              </p>
            </Card>
          )}

          {/* 2. Keywords */}
          {feedback.keywords && feedback.keywords.length > 0 && (
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Hash className="w-5 h-5" style={{ color: "#6B7A6F" }} />
                <h2 style={{ color: "#333333", fontSize: "1.05rem" }}>
                  키워드
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {feedback.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    className="rounded-full px-3 py-1"
                    style={{
                      backgroundColor: "#EFE9E3",
                      color: "#6B7A6F",
                      fontSize: "0.85rem",
                    }}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* 3. Observation */}
          {feedback.observation && (
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5" style={{ color: "#A3BFD9" }} />
                <h2 style={{ color: "#333333", fontSize: "1.05rem" }}>관찰</h2>
              </div>
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                {feedback.observation}
              </p>
            </Card>
          )}

          {/* 4. Insight */}
          {feedback.insight && (
            <Card
              className="p-5"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" style={{ color: "#B89A7A" }} />
                <h2 style={{ color: "#333333", fontSize: "1.05rem" }}>
                  인사이트
                </h2>
              </div>
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                {feedback.insight}
              </p>
            </Card>
          )}

          {/* 5. Action Feedback */}
          {feedback.action_feedback && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Well Done */}
              {feedback.action_feedback.well_done && (
                <Card
                  className="p-5"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #EFE9E3",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2
                      className="w-5 h-5"
                      style={{ color: "#7BA87B" }}
                    />
                    <h3 style={{ color: "#333333", fontSize: "1rem" }}>
                      잘한 점
                    </h3>
                  </div>
                  <p
                    style={{
                      color: "#333333",
                      lineHeight: "1.6",
                      fontSize: "0.85rem",
                    }}
                  >
                    {feedback.action_feedback.well_done}
                  </p>
                </Card>
              )}

              {/* To Improve */}
              {feedback.action_feedback.to_improve && (
                <Card
                  className="p-5"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #EFE9E3",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: "#B89A7A" }}
                    />
                    <h3 style={{ color: "#333333", fontSize: "1rem" }}>
                      개선하면 좋을 점
                    </h3>
                  </div>
                  <p
                    style={{
                      color: "#333333",
                      lineHeight: "1.6",
                      fontSize: "0.85rem",
                    }}
                  >
                    {feedback.action_feedback.to_improve}
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 6. Focus Tomorrow */}
          {feedback.focus_tomorrow && (
            <Card
              className="p-5"
              style={{ backgroundColor: "#EFE9E3", border: "none" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5" style={{ color: "#6B7A6F" }} />
                <h2 style={{ color: "#333333", fontSize: "1.05rem" }}>
                  내일의 초점
                </h2>
              </div>
              <p
                style={{
                  color: "#333333",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                {feedback.focus_tomorrow}
              </p>
            </Card>
          )}

          {/* 7. Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus Score */}
            {feedback.focus_score !== undefined && (
              <Card
                className="p-5"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #EFE9E3",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ color: "#333333", fontSize: "0.95rem" }}>
                    집중/몰입 점수
                  </h3>
                  <span style={{ color: "#6B7A6F", fontSize: "1.2rem" }}>
                    {clampScore(feedback.focus_score)}/10
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2 overflow-hidden"
                  style={{ backgroundColor: "#EFE9E3" }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${clampScore(feedback.focus_score) * 10}%`,
                      background:
                        "linear-gradient(90deg, #A8BBA8 0%, #6B7A6F 100%)",
                    }}
                  />
                </div>
              </Card>
            )}

            {/* Satisfaction Score */}
            {feedback.satisfaction_score !== undefined && (
              <Card
                className="p-5"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #EFE9E3",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ color: "#333333", fontSize: "0.95rem" }}>
                    만족도
                  </h3>
                  <span style={{ color: "#6B7A6F", fontSize: "1.2rem" }}>
                    {clampScore(feedback.satisfaction_score)}/10
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2 overflow-hidden"
                  style={{ backgroundColor: "#EFE9E3" }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${clampScore(feedback.satisfaction_score) * 10}%`,
                      background:
                        "linear-gradient(90deg, #D08C60 0%, #A3BFD9 100%)",
                    }}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
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
              돌아가기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
