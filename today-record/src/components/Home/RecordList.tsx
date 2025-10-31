import { PenLine } from "lucide-react";
import { RecordItem } from "./RecordItem";
import { type Record } from "../../hooks/useRecords";

interface RecordListProps {
  records: Record[];
  isLoading: boolean;
  error?: unknown;
  onEdit: (record: Record) => void;
  onDelete: (id: number) => void;
}

export function RecordList({
  records,
  isLoading,
  error,
  onEdit,
  onDelete,
}: RecordListProps) {
  const todayRecords = records.filter((record) => {
    const today = new Date();
    const recordDate = new Date(record.kst_date);
    return today.toDateString() === recordDate.toDateString();
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "#4E4B46", opacity: 0.6 }}>기록을 불러오는 중...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "#B1736C" }}>기록을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  // Empty State
  if (todayRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <PenLine
          className="w-12 h-12 mx-auto mb-3"
          style={{ color: "#A8BBA8", opacity: 0.5 }}
        />
        <p
          style={{
            color: "#4E4B46",
            opacity: 0.6,
            fontSize: "0.9rem",
          }}
        >
          오늘의 첫 기록을 시작해보세요
        </p>
      </div>
    );
  }

  // Records List
  return (
    <div className="mb-6">
      <h2 className="mb-4" style={{ color: "#333333", fontSize: "1.1rem" }}>
        오늘의 타임라인
      </h2>
      <div className="space-y-3">
        {todayRecords.map((record) => (
          <RecordItem
            key={record.id}
            record={record}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
