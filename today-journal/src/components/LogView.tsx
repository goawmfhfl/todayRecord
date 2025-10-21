"use client";

import { useState } from "react";
import { DayPicker as Calendar } from "react-day-picker";
import { Card } from "./ui/card";
import type { Entry } from "@/types/Entry";
import { ko } from "date-fns/locale";

type LogViewProps = {
  entries: Entry[];
  onSelectDate: (date: Date) => void;
};

export function LogView({ entries, onSelectDate }: LogViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const datesWithEntries = new Set(
    entries.map(
      (entry) => new Date(entry.timestamp).toISOString().split("T")[0]
    )
  );

  const handleSelectDate = (date: Date | undefined) => {
    if (date) onSelectDate(date);
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
        <Card className="flex justify-center p-4 mb-6 rounded-xl border bg-white border-[#EFE9E3] ">
          <div className="relative p-2 w-100">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                onSelect={handleSelectDate}
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                locale={ko}
                className="p-3"
                classNames={{
                  month: "flex items-center justify-center flex-col gap-3",
                  caption_label: "text-sm font-medium text-[#333333]",
                  day: "h-9 w-9 rounded-md p-0 font-normal text-[#333333] hover:bg-accent hover:text-accent-foreground active:bg-[#EFE9E3] active:scale-95 transition",
                  button_previous: "absolute left-15",
                  button_next: "absolute right-15",
                  weekday: "text-sm font-medium text-[#b7c1ba]",
                  day_button:
                    "h-9 w-9 rounded-md p-0 font-normal text-[#333333] hover:bg-accent hover:text-accent-foreground active:bg-[#EFE9E3] active:scale-95 transition",
                }}
                navLayout={undefined}
                modifiers={{
                  hasEntries: (date) =>
                    datesWithEntries.has(date.toISOString().split("T")[0]),
                }}
                modifiersClassNames={{ hasEntries: "has-entries" }}
              />
            </div>
          </div>
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
                                : entry.type === "emotion"
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
