import { useState } from "react";
import { Sparkles, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useRecords, type Record } from "../hooks/useRecords";
import { RecordForm } from "./Home/RecordForm";
import { RecordList } from "./Home/RecordList";
import { EditRecordDialog } from "./Home/EditRecordDialog";
import { DeleteRecordDialog } from "./Home/DeleteRecordDialog";

export function Home() {
  // React Query 훅들
  const { data: records = [], isLoading, error } = useRecords();

  // 다이얼로그 상태
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<number | null>(null);

  // 오늘 기록 필터링
  const todayRecords = records.filter((record) => {
    const today = new Date();
    const recordDate = new Date(record.kst_date);
    return today.toDateString() === recordDate.toDateString();
  });

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
  };

  const handleDelete = (id: number) => {
    setDeletingRecordId(id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1
              className="mb-1"
              style={{ color: "#333333", fontSize: "1.5rem" }}
            >
              오늘의 기록
            </h1>
            <p
              style={{
                color: "#4E4B46",
                opacity: 0.7,
                fontSize: "0.9rem",
              }}
            >
              {new Date().toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "#F3F4F6",
                border: "1px solid #EFE9E3",
              }}
            >
              <User className="w-3.5 h-3.5" style={{ color: "#6B7A6F" }} />
              <span
                style={{
                  color: "#4E4B46",
                  fontSize: "0.8rem",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {"goawmfhfl1@naver.com"}
              </span>
            </div>
            <button
              className="p-2 rounded-full transition-all hover:bg-gray-100"
              style={{ color: "#6B7A6F" }}
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Record Form */}
      <RecordForm />

      {/* Record List */}
      <RecordList
        records={records}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Generate Feedback Button */}
      {todayRecords.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4">
          <Button
            onClick={() => {
              // TODO: 피드백 생성 로직 구현
              console.log("피드백 생성");
            }}
            className="rounded-full shadow-lg"
            style={{
              backgroundColor: "#6B7A6F",
              color: "white",
              padding: "0.875rem 2rem",
              fontSize: "0.9rem",
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            오늘 피드백 받기
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <EditRecordDialog
        record={editingRecord}
        open={!!editingRecord}
        onOpenChange={(open) => !open && setEditingRecord(null)}
      />

      <DeleteRecordDialog
        recordId={deletingRecordId}
        open={!!deletingRecordId}
        onOpenChange={(open) => !open && setDeletingRecordId(null)}
      />
    </div>
  );
}
