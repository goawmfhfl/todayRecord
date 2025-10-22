"use client";

import { LogView } from "@/components/LogView";
import { useJournal } from "../providers";

export default function LogsPage() {
  const { entries } = useJournal();

  return <LogView entries={entries} onSelectDate={() => {}} />;
}
