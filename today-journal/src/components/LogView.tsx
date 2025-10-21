"use client";

import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Entry } from "@/types/Entry";
import { DayPicker } from "react-day-picker";
import { ko } from "react-day-picker/locale";
// 캘린더 데이터 타입 정의
type CalendarLogMap = Record<string, { hasLog: boolean }>;

interface CalendarProps {
  year: number;
  month: number;
  logs: CalendarLogMap;
  onSelectDate?: (isoDate: string) => void;
  locale?: "ko" | "en";
  startOfWeek?: "sun" | "mon";
}

type LogViewProps = {
  entries: Entry[];
  onSelectDate: (date: Date) => void;
};

// 캘린더 매트릭스 생성 함수
function getCalendarMatrix(
  year: number,
  month: number,
  startOfWeek: "sun" | "mon" = "sun"
) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDay =
    startOfWeek === "sun" ? firstDay.getDay() : (firstDay.getDay() + 6) % 7;

  const matrix: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  // 이전 달 빈 칸들
  for (let i = 0; i < startDay; i++) {
    const prevMonthDay = new Date(year, month - 1, -startDay + i + 1);
    currentWeek.push(prevMonthDay);
  }

  // 현재 달 날짜들
  for (let day = 1; day <= lastDay.getDate(); day++) {
    currentWeek.push(new Date(year, month - 1, day));

    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }

  // 다음 달 빈 칸들
  let nextMonthDay = 1;
  while (currentWeek.length < 7) {
    currentWeek.push(new Date(year, month, nextMonthDay));
    nextMonthDay++;
  }

  if (currentWeek.length > 0) {
    matrix.push(currentWeek);
  }

  return matrix;
}

// 로컬 날짜 문자열 생성 함수 (시간대 문제 해결)
function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 오늘 날짜 확인 함수 (한국 시간 기준)
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// 캘린더 컴포넌트
function Calendar({
  year,
  month,
  logs,
  onSelectDate,
  locale = "ko",
  startOfWeek = "sun",
  selectedDate,
}: CalendarProps & { selectedDate: Date }) {
  const matrix = useMemo(
    () => getCalendarMatrix(year, month, startOfWeek),
    [year, month, startOfWeek]
  );

  const weekdays =
    locale === "ko"
      ? ["일", "월", "화", "수", "목", "금", "토"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDateClick = (date: Date) => {
    if (onSelectDate) {
      onSelectDate(toISODate(date));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, date: Date) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleDateClick(date);
    }
  };

  return (
    <div className="w-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium"
            style={{ color: "#6B7A6F" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {matrix.map((week, weekIndex) =>
          week.map((date, dayIndex) => {
            if (!date)
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="aspect-square"
                />
              );

            const isoDate = toISODate(date);
            const hasLog = logs[isoDate]?.hasLog || false;
            const isCurrentMonth = date.getMonth() === month - 1;
            const isTodayDate = isToday(date);
            const isSelected =
              selectedDate.toISOString().split("T")[0] === isoDate;

            return (
              <button
                key={isoDate}
                className={`
                  relative flex flex-col items-center justify-center
                  aspect-square rounded-lg text-sm font-normal
                  focus:outline-none focus:ring-2 focus:ring-gray-300
                  ${
                    isCurrentMonth
                      ? "text-gray-900"
                      : "text-gray-400 opacity-40"
                  }
                  ${isTodayDate ? "ring-2 ring-gray-300" : ""}
                  ${
                    isSelected
                      ? "bg-[#6B7A6F] text-white hover:bg-[#5A6A5F]"
                      : "hover:bg-gray-100"
                  }
                `}
                onClick={() => handleDateClick(date)}
                onKeyDown={(e) => handleKeyDown(e, date)}
                aria-label={`${isoDate}, ${hasLog ? "기록 있음" : "기록 없음"}${
                  isTodayDate ? ", 오늘" : ""
                }${isSelected ? ", 선택됨" : ""}`}
                tabIndex={0}
              >
                {/* 날짜 숫자 */}
                <span className="text-sm">{date.getDate()}</span>

                {/* 기록 점 */}
                {hasLog && (
                  <div
                    className="absolute h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: "#FFD23F",
                      bottom: "8%",
                    }}
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export function LogView({ entries, onSelectDate }: LogViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // 로컬 시간 기준으로 오늘 날짜 계산
  const getTodayInKorea = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getTodayInKorea()); // 정확한 오늘 날짜로 초기화

  // entries를 CalendarLogMap 형태로 변환 (로컬 시간 기준)
  const logs = useMemo(() => {
    const logMap: CalendarLogMap = {};
    entries.forEach((entry) => {
      // 로컬 시간 기준으로 날짜 키 생성
      const entryDate = new Date(entry.timestamp);
      const isoDate = toISODate(entryDate);
      logMap[isoDate] = { hasLog: true };
    });
    return logMap;
  }, [entries]);

  const handleSelectDate = (isoDate: string) => {
    const date = new Date(isoDate);
    setSelectedDate(date);
    // 페이지 이동 없이 상태만 업데이트
  };

  const handlePrevMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  };

  // 선택된 날짜의 기록들 필터링
  const selectedDateEntries = useMemo(() => {
    const selectedIsoDate = toISODate(selectedDate);
    return entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const entryIsoDate = toISODate(entryDate);
      return entryIsoDate === selectedIsoDate;
    });
  }, [entries, selectedDate]);

  // 선택된 날짜가 오늘인지 확인
  const isToday = useMemo(() => {
    const today = getTodayInKorea();
    return toISODate(selectedDate) === toISODate(today);
  }, [selectedDate]);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#FAFAF8" }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="mb-1" style={{ color: "#333333", fontSize: "1.5rem" }}>
            지난 기록
          </h1>
          <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}>
            총 {entries.length}개의 기록
          </p>
        </header>

        {/* Calendar */}
        <Card className="p-6 mb-6 rounded-xl border bg-white border-[#EFE9E3]">
          {/* 월/년도 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: "#6B7A6F" }}
              aria-label="이전 달"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h2 className="text-lg font-semibold" style={{ color: "#333333" }}>
              {selectedMonth.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
              })}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: "#6B7A6F" }}
              aria-label="다음 달"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* 캘린더 그리드 */}
          <Calendar
            year={selectedMonth.getFullYear()}
            month={selectedMonth.getMonth() + 1}
            logs={logs}
            onSelectDate={handleSelectDate}
            locale="ko"
            startOfWeek="sun"
            selectedDate={selectedDate}
          />
        </Card>

        {/* 선택된 날짜의 기록들 */}
        <div className="mb-6">
          <h2 className="mb-4" style={{ color: "#333333", fontSize: "1.1rem" }}>
            {selectedDate.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
            {isToday && " (오늘)"}
          </h2>

          {selectedDateEntries.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="p-4"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #EFE9E3",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor:
                          entry.type === "insight" ? "#A8BBA8" : "#A3BFD9",
                        color: "white",
                        fontSize: "0.8rem",
                      }}
                    >
                      {entry.type === "insight" ? "💡" : "📝"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className="rounded-full px-2 py-1"
                          style={{
                            backgroundColor:
                              entry.type === "insight" ? "#A8BBA8" : "#A3BFD9",
                            color: "white",
                            fontSize: "0.75rem",
                          }}
                        >
                          {entry.type === "insight" ? "인사이트" : "피드백"}
                        </Badge>
                        <span
                          style={{
                            color: "#4E4B46",
                            opacity: 0.6,
                            fontSize: "0.8rem",
                          }}
                        >
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "ko-KR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#333333",
                          lineHeight: "1.6",
                          fontSize: "0.9rem",
                        }}
                      >
                        {entry.content}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: "#4E4B46", opacity: 0.6, fontSize: "0.9rem" }}>
                이 날에는 기록이 없습니다
              </p>
            </div>
          )}
        </div>

        {/* AI 리뷰 섹션 */}
        {selectedDateEntries.length > 0 && (
          <Card
            className="p-6"
            style={{
              backgroundColor: "#A8BBA8",
              color: "white",
              border: "none",
            }}
          >
            <h3 className="mb-3" style={{ fontSize: "1rem", opacity: 0.9 }}>
              🤖 AI 리뷰
            </h3>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.7" }}>
              {isToday
                ? "오늘은 새로운 시작에 대한 에너지가 느껴집니다. 기록된 내용들을 보면 성장에 대한 의지가 강하게 드러나네요. 작은 변화들도 의미 있게 기록하고 계시는 모습이 인상적입니다."
                : `${
                    selectedDateEntries.length
                  }개의 기록을 통해 이 날의 패턴을 분석해보니, ${
                    selectedDateEntries.some((e) => e.type === "insight")
                      ? "인사이트"
                      : "피드백"
                  } 중심의 성찰이 돋보입니다. 꾸준한 기록 습관이 자기 인식의 깊이를 더해주고 있네요.`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
