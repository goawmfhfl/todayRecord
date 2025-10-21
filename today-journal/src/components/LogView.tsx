"use client";

import { useState, useMemo } from "react";
import { Card } from "./ui/card";
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

// ISO 날짜 문자열 생성 함수
function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
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
}: CalendarProps) {
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

            return (
              <button
                key={isoDate}
                className={`
                  relative flex flex-col items-center justify-center
                  aspect-square rounded-lg text-sm font-normal
                  transition-all duration-150 ease-in-out
                  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300
                  ${
                    isCurrentMonth
                      ? "text-gray-900"
                      : "text-gray-400 opacity-40"
                  }
                  ${isTodayDate ? "ring-1 ring-blue-500 bg-blue-50" : ""}
                `}
                onClick={() => handleDateClick(date)}
                onKeyDown={(e) => handleKeyDown(e, date)}
                aria-label={`${isoDate}, ${hasLog ? "기록 있음" : "기록 없음"}${
                  isTodayDate ? ", 오늘" : ""
                }`}
                tabIndex={0}
              >
                {/* 날짜 숫자 */}
                <span className="text-sm">{date.getDate()}</span>

                {/* 기록 점 */}
                {hasLog && (
                  <div
                    className="mt-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "#FFD23F" }}
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

  // entries를 CalendarLogMap 형태로 변환
  const logs = useMemo(() => {
    const logMap: CalendarLogMap = {};
    entries.forEach((entry) => {
      const isoDate = new Date(entry.timestamp).toISOString().split("T")[0];
      logMap[isoDate] = { hasLog: true };
    });
    return logMap;
  }, [entries]);

  const handleSelectDate = (isoDate: string) => {
    const date = new Date(isoDate);
    onSelectDate(date);
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

  const monthEntries = entries.filter((entry) => {
    const d = new Date(entry.timestamp);
    return (
      d.getMonth() === selectedMonth.getMonth() &&
      d.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const entriesByDate = monthEntries.reduce((acc, entry) => {
    const key = new Date(entry.timestamp).toISOString().split("T")[0];
    (acc[key] ||= []).push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

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
          />
        </Card>

        {/* Month Summary */}
        <div>
          <h2 className="mb-4" style={{ color: "#333333", fontSize: "1.1rem" }}>
            {selectedMonth.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
            })}
          </h2>

          {Object.keys(entriesByDate).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(entriesByDate)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([dateKey, dayEntries]) => {
                  const date = new Date(dateKey);
                  return (
                    <Card
                      key={dateKey}
                      className="p-4 cursor-pointer transition-all hover:shadow-md"
                      onClick={() => onSelectDate(date)}
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #EFE9E3",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            style={{
                              color: "#333333",
                              fontSize: "0.95rem",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {date.toLocaleDateString("ko-KR", {
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            })}
                          </p>
                          <p
                            style={{
                              color: "#4E4B46",
                              opacity: 0.6,
                              fontSize: "0.8rem",
                            }}
                          >
                            {dayEntries.length}개의 기록
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {dayEntries.slice(0, 3).map((entry) => {
                            const color =
                              entry.type === "insight"
                                ? "#A8BBA8"
                                : entry.type === "feedback"
                                ? "#A3BFD9"
                                : "#D08C60";
                            return (
                              <div
                                key={entry.id}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            );
                          })}
                          {dayEntries.length > 3 && (
                            <span
                              style={{
                                color: "#4E4B46",
                                opacity: 0.5,
                                fontSize: "0.75rem",
                                marginLeft: "0.25rem",
                              }}
                            >
                              +{dayEntries.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: "#4E4B46", opacity: 0.6, fontSize: "0.9rem" }}>
                이번 달에는 기록이 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
