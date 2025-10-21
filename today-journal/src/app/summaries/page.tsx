"use client";

import { SummariesView } from "@/components/SummariesView";
import { useJournalStore } from "@/app/store/useJournalStore";

export default function SummariesPage() {
  const { entries, summaries, generateSummary, selectSummary } =
    useJournalStore();

  return (
    <SummariesView
      entries={entries}
      summaries={summaries}
      onGenerateSummary={generateSummary}
      onSelectSummary={selectSummary}
    />
  );
}
