import { useState } from "react";
import {
  PenLine,
  Sparkles,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import type { Entry } from "../types/Entry";
import { useJournal } from "../app/providers";

export function Home() {
  const { entries, addEntry, editEntry, deleteEntry, generateFeedback } =
    useJournal();
  const [selectedType, setSelectedType] = useState<Entry["type"]>("insight");
  const [content, setContent] = useState("");
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editType, setEditType] = useState<Entry["type"]>("insight");
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (content.trim()) {
      addEntry(selectedType, content);
      setContent("");
    }
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setEditContent(entry.content);
    setEditType(entry.type);
  };

  const handleSaveEdit = () => {
    if (editingEntry && editContent.trim()) {
      editEntry(editingEntry.id, editContent, editType);
      setEditingEntry(null);
      setEditContent("");
    }
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setDeletingEntryId(null);
  };

  const getTypeLabel = (type: Entry["type"]) => {
    switch (type) {
      case "insight":
        return "인사이트";
      case "feedback":
        return "피드백";
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours % 12 || 12;
    return `${period} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
  };

  const todayEntries = entries.filter((entry) => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return today.toDateString() === entryDate.toDateString();
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <header className="mb-6">
        <h1 className="mb-1" style={{ color: "#333333", fontSize: "1.5rem" }}>
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
      </header>

      {/* Entry Form */}
      <div
        className="mb-6 p-5 rounded-2xl"
        style={{ backgroundColor: "#F3F4F6" }}
      >
        <div className="flex gap-2 mb-4">
          {(["insight", "feedback"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="px-3 py-1.5 rounded-full transition-all text-sm"
              style={{
                backgroundColor:
                  selectedType === type ? "#A8BBA8" : "transparent",
                color: selectedType === type ? "white" : "#4E4B46",
                border: selectedType === type ? "none" : "1px solid #E5E7EB",
              }}
            >
              {getTypeLabel(type)}
            </button>
          ))}
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘의 인사이트를 기록하세요..."
          className="min-h-[100px] mb-3 border-0 resize-none text-sm"
          style={{
            backgroundColor: "white",
            color: "#333333",
            lineHeight: "1.6",
          }}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            size="sm"
            style={{
              backgroundColor: "#A8BBA8",
              color: "white",
            }}
            className="hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            기록 추가
          </Button>
        </div>
      </div>

      {/* Today's Timeline */}
      {todayEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4" style={{ color: "#333333", fontSize: "1.1rem" }}>
            오늘의 타임라인
          </h2>
          <div className="space-y-3">
            {todayEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #EFE9E3",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor:
                          entry.type === "insight"
                            ? "#A8BBA8"
                            : entry.type === "feedback"
                            ? "#A3BFD9"
                            : "#D08C60",
                        color: "white",
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.75rem",
                      }}
                    >
                      {getTypeLabel(entry.type)}
                    </Badge>
                    <span
                      style={{
                        color: "#4E4B46",
                        opacity: 0.5,
                        fontSize: "0.8rem",
                      }}
                    >
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ color: "#6B7A6F" }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(entry)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        수정하기
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingEntryId(entry.id)}
                        style={{ color: "#B1736C" }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p
                  style={{
                    color: "#333333",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                  }}
                >
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Feedback Button */}
      {todayEntries.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4">
          <Button
            onClick={() => generateFeedback()}
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

      {/* Empty State */}
      {todayEntries.length === 0 && (
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
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingEntry}
        onOpenChange={(open) => !open && setEditingEntry(null)}
      >
        <DialogContent style={{ backgroundColor: "#FAFAF8" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#333333" }}>
              기록 수정하기
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-3">
              {(["insight", "feedback"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setEditType(type)}
                  className="px-4 py-2 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      editType === type ? "#A8BBA8" : "transparent",
                    color: editType === type ? "white" : "#4E4B46",
                    border: editType === type ? "none" : "1px solid #E5E7EB",
                  }}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>

            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[150px] resize-none"
              style={{
                backgroundColor: "white",
                color: "#333333",
                lineHeight: "1.7",
              }}
            />
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditingEntry(null)}
              style={{ color: "#6B7A6F" }}
            >
              취소
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              style={{
                backgroundColor: "#A8BBA8",
                color: "white",
              }}
            >
              저장하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deletingEntryId}
        onOpenChange={(open) => !open && setDeletingEntryId(null)}
      >
        <AlertDialogContent style={{ backgroundColor: "#FAFAF8" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#333333" }}>
              기록을 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#4E4B46" }}>
              이 작업은 되돌릴 수 없습니다. 정말로 이 기록을 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ color: "#6B7A6F" }}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEntryId && handleDelete(deletingEntryId)}
              style={{
                backgroundColor: "#B1736C",
                color: "white",
              }}
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
