import { useState, useEffect } from "react";
import { Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import type { Entry, PeriodSummary } from "@/types/Entry";

type SummariesViewProps = {
  entries: Entry[];
  summaries: PeriodSummary[];
  onGenerateSummary: (
    type: "weekly" | "monthly",
    weekNumber?: number,
    monthNumber?: number,
    year?: number
  ) => void;
  onSelectSummary: (summary: PeriodSummary) => void;
};

export function SummariesView({
  entries,
  summaries,
  onGenerateSummary,
  onSelectSummary,
}: SummariesViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter summaries by type
  const filteredSummaries = summaries.filter((s) => s.type === activeTab);

  // Sort by most recent first
  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    if (a.year !== b.year) return (b.year || 0) - (a.year || 0);
    if (activeTab === "weekly") {
      return (b.weekNumber || 0) - (a.weekNumber || 0);
    } else {
      return (b.monthNumber || 0) - (a.monthNumber || 0);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedSummaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSummaries = sortedSummaries.slice(startIndex, endIndex);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1
              className="mb-1"
              style={{ color: "#333333", fontSize: "1.5rem" }}
            >
              분석 & 요약
            </h1>
            <p style={{ color: "#4E4B46", opacity: 0.7, fontSize: "0.9rem" }}>
              주간 및 월간 기록을 분석하고 인사이트를 확인하세요
            </p>
          </div>
          <Button
            onClick={() => {
              const now = new Date();
              const currentYear = now.getFullYear();
              const currentWeek = Math.ceil(
                ((now.getTime() - new Date(currentYear, 0, 1).getTime()) /
                  86400000 +
                  new Date(currentYear, 0, 1).getDay() +
                  1) /
                  7
              );
              const currentMonth = now.getMonth() + 1;

              if (activeTab === "weekly") {
                onGenerateSummary(
                  "weekly",
                  currentWeek,
                  undefined,
                  currentYear
                );
              } else {
                onGenerateSummary(
                  "monthly",
                  undefined,
                  currentMonth,
                  currentYear
                );
              }
            }}
            className="rounded-full flex-shrink-0"
            style={{
              backgroundColor: activeTab === "weekly" ? "#A8BBA8" : "#6B7A6F",
              color: "white",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
            }}
          >
            샘플 생성
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v: string) => setActiveTab(v as "weekly" | "monthly")}
        className="space-y-6"
      >
        <TabsList
          className="grid w-full grid-cols-2 h-12 rounded-xl p-1"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <TabsTrigger
            value="weekly"
            className="flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium"
            style={{
              backgroundColor:
                activeTab === "weekly" ? "#A8BBA8" : "transparent",
              color: activeTab === "weekly" ? "white" : "#4E4B46",
              fontWeight: activeTab === "weekly" ? "600" : "500",
            }}
          >
            주간 요약
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium"
            style={{
              backgroundColor:
                activeTab === "monthly" ? "#6B7A6F" : "transparent",
              color: activeTab === "monthly" ? "white" : "#4E4B46",
              fontWeight: activeTab === "monthly" ? "600" : "500",
            }}
          >
            월간 요약
          </TabsTrigger>
        </TabsList>

        {/* Weekly Tab */}
        <TabsContent value="weekly" className="space-y-4">
          {/* Summary List */}
          {currentSummaries.length > 0 ? (
            <div className="space-y-3">
              {currentSummaries.map((summary) => (
                <Card
                  key={summary.id}
                  className="p-4 cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
                  onClick={() =>
                    router.push(`/summaries/feedback/weekly/${summary.id}`)
                  }
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #EFE9E3",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: "#A8BBA8" }}
                      >
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: "white" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="truncate"
                          style={{ color: "#333333", fontSize: "1rem" }}
                        >
                          {summary.period} 주간 인사이트 & 피드백
                        </h3>
                        <p
                          className="truncate"
                          style={{
                            color: "#4E4B46",
                            opacity: 0.7,
                            fontSize: "0.8rem",
                          }}
                        >
                          {summary.dateRange}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card
              className="p-8 text-center"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <TrendingUp
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "#E0E0E0" }}
              />
              <p style={{ color: "#4E4B46", fontSize: "0.95rem" }}>
                아직 주간 데이터가 존재하지 않습니다.
              </p>
              <p
                style={{
                  color: "#4E4B46",
                  opacity: 0.6,
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                일상 기록을 작성하면 자동으로 주간 요약이 생성됩니다.
              </p>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                style={{
                  borderColor: "#EFE9E3",
                  color: currentPage === 1 ? "#E0E0E0" : "#6B7A6F",
                  backgroundColor: "white",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          currentPage === page ? "#A8BBA8" : "transparent",
                        color: currentPage === page ? "white" : "#6B7A6F",
                        fontSize: "0.85rem",
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
                style={{
                  borderColor: "#EFE9E3",
                  color: currentPage === totalPages ? "#E0E0E0" : "#6B7A6F",
                  backgroundColor: "white",
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Monthly Tab */}
        <TabsContent value="monthly" className="space-y-4">
          {/* Summary List */}
          {currentSummaries.length > 0 ? (
            <div className="space-y-3">
              {currentSummaries.map((summary) => (
                <Card
                  key={summary.id}
                  className="p-4 cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
                  onClick={() =>
                    router.push(`/summaries/feedback/monthly/${summary.id}`)
                  }
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #EFE9E3",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: "#6B7A6F" }}
                      >
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: "white" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="truncate"
                          style={{ color: "#333333", fontSize: "1rem" }}
                        >
                          {summary.period} 월간 인사이트 & 피드백
                        </h3>
                        <p
                          className="truncate"
                          style={{
                            color: "#4E4B46",
                            opacity: 0.7,
                            fontSize: "0.8rem",
                          }}
                        >
                          {summary.dateRange}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card
              className="p-8 text-center"
              style={{ backgroundColor: "white", border: "1px solid #EFE9E3" }}
            >
              <TrendingUp
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "#E0E0E0" }}
              />
              <p style={{ color: "#4E4B46", fontSize: "0.95rem" }}>
                아직 월간 데이터가 존재하지 않습니다.
              </p>
              <p
                style={{
                  color: "#4E4B46",
                  opacity: 0.6,
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                일상 기록을 작성하면 자동으로 월간 요약이 생성됩니다.
              </p>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                style={{
                  borderColor: "#EFE9E3",
                  color: currentPage === 1 ? "#E0E0E0" : "#6B7A6F",
                  backgroundColor: "white",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          currentPage === page ? "#6B7A6F" : "transparent",
                        color: currentPage === page ? "white" : "#6B7A6F",
                        fontSize: "0.85rem",
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
                style={{
                  borderColor: "#EFE9E3",
                  color: currentPage === totalPages ? "#E0E0E0" : "#6B7A6F",
                  backgroundColor: "white",
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
