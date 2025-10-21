import { useState } from "react";
import { BarChart3, CalendarRange } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "@/components/ui/card";
import { useJournal } from "../app/providers";
import { ko } from "date-fns/locale";
import { DayPicker as Calendar } from "react-day-picker";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export function SummariesView() {
  const { generatePeriodSummary } = useJournal();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleCustomRangeSummary = () => {
    if (dateRange.from && dateRange.to) {
      generatePeriodSummary("weekly", dateRange.from, dateRange.to);
      setDateRange({ from: undefined, to: undefined });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <header className="mb-6">
        <h1 className="mb-1" style={{ color: "#333333", fontSize: "1.5rem" }}>
          분석 & 요약
        </h1>
        <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}>
          기간별로 기록을 분석하고 인사이트를 확인하세요
        </p>
      </header>

      {/* Quick Summary Buttons */}
      <div className="mb-6">
        <h2 className="mb-4" style={{ color: "#333333", fontSize: "1.1rem" }}>
          빠른 요약
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <Card
            className="p-5 cursor-pointer transition-all active:scale-95"
            onClick={() => generatePeriodSummary("weekly")}
            style={{
              backgroundColor: "white",
              border: "2px solid #A8BBA8",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl flex-shrink-0"
                style={{ backgroundColor: "#A8BBA8" }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: "white" }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="mb-0.5"
                  style={{ color: "#333333", fontSize: "1rem" }}
                >
                  주간 요약
                </h3>
                <p
                  style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.8rem" }}
                >
                  최근 7일간의 기록을 분석합니다
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-5 cursor-pointer transition-all active:scale-95"
            onClick={() => generatePeriodSummary("monthly")}
            style={{
              backgroundColor: "white",
              border: "2px solid #6B7A6F",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl flex-shrink-0"
                style={{ backgroundColor: "#6B7A6F" }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: "white" }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="mb-0.5"
                  style={{ color: "#333333", fontSize: "1rem" }}
                >
                  월간 요약
                </h3>
                <p
                  style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.8rem" }}
                >
                  이번 달 전체 기록을 분석합니다
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Custom Date Range */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarRange className="w-5 h-5" style={{ color: "#D08C60" }} />
          <h2 style={{ color: "#333333", fontSize: "1.1rem" }}>
            커스텀 기간 선택
          </h2>
        </div>

        <Card
          className="p-5"
          style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
        >
          <p className="mb-4" style={{ color: "#4E4B46", fontSize: "0.9rem" }}>
            원하는 날짜 범위를 선택하여 맞춤 분석을 받아보세요
          </p>

          <div className="space-y-5">
            <div className="flex flex-col">
              <p style={{ color: "#333333", fontSize: "0.95rem" }}>시작일</p>

              <div className="flex justify-center rounded-xl border ">
                <div className="relative p-2 w-100">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date?: Date) => {
                      if (!date) {
                        setDateRange({ from: undefined, to: undefined });
                        return;
                      }
                      if (dateRange.to && date > dateRange.to) {
                        setDateRange({ from: date, to: undefined });
                      } else {
                        setDateRange({ ...dateRange, from: date });
                      }
                    }}
                    disabled={(d: Date) =>
                      d > new Date() || d < new Date("1900-01-01")
                    }
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
                  />
                </div>
              </div>
            </div>

            {dateRange.from && (
              <div>
                <p
                  className="mb-2"
                  style={{ color: "#333333", fontSize: "0.95rem" }}
                >
                  종료일
                </p>
                <div className="flex justify-center rounded-xl border ">
                  <div className="relative p-2 w-100">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date?: Date) => {
                        if (!date) {
                          setDateRange({ ...dateRange, to: undefined });
                          return;
                        }
                        if (!dateRange.from) return;
                        if (date < dateRange.from) return;
                        setDateRange({ ...dateRange, to: date });
                      }}
                      disabled={(d: Date) =>
                        !dateRange.from ||
                        d < (dateRange.from as Date) ||
                        d > new Date()
                      }
                      locale={ko}
                      className="p-3"
                      classNames={{
                        month:
                          "flex items-center justify-center flex-col gap-3",
                        caption_label: "text-sm font-medium text-[#333333]",
                        day: "h-9 w-9 rounded-md p-0 font-normal text-[#333333] hover:bg-accent hover:text-accent-foreground active:bg-[#EFE9E3] active:scale-95 transition",
                        button_previous: "absolute left-15",
                        button_next: "absolute right-15",
                        weekday: "text-sm font-medium text-[#b7c1ba]",
                        day_button:
                          "h-9 w-9 rounded-md p-0 font-normal text-[#333333] hover:bg-accent hover:text-accent-foreground active:bg-[#EFE9E3] active:scale-95 transition",
                      }}
                      navLayout={undefined}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {dateRange.from && dateRange.to && (
            <div
              className="mt-5 pt-4"
              style={{ borderTop: "1px solid #EFE9E3" }}
            >
              <div className="space-y-3">
                <div>
                  <p
                    style={{
                      color: "#4E4B46",
                      fontSize: "0.8rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    선택된 기간
                  </p>
                  <p style={{ color: "#333333", fontSize: "0.95rem" }}>
                    {dateRange.from.toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {dateRange.to.toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  onClick={handleCustomRangeSummary}
                  className="w-full"
                  style={{
                    backgroundColor: "#D08C60",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  요약 생성하기
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
