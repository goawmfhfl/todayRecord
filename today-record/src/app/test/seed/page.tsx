"use client";

import { useState } from "react";

export default function SeedTestPage() {
  const [userId, setUserId] = useState("00000000-0000-0000-0000-000000000000");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    ok: boolean;
    [k: string]: unknown;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSeed() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data === "object" ? JSON.stringify(data) : String(data)
        );
      }
      setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#000" }}>
        Seed Test
      </h1>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600, color: "#000" }}>User ID</span>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="UUID"
            style={{
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 6,
              color: "#000",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600, color: "#000" }}>Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="feedback 내용"
            style={{
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 6,
              color: "#000",
            }}
          />
        </label>

        <button
          onClick={handleSeed}
          disabled={loading}
          style={{
            padding: "10px 14px",
            background: loading ? "#888" : "#111",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          {loading ? "Seeding..." : "Call /api/seed"}
        </button>
      </div>

      {error && (
        <pre
          style={{ marginTop: 16, color: "#b00020", whiteSpace: "pre-wrap" }}
        >
          {error}
        </pre>
      )}
      {result && (
        <pre
          style={{
            marginTop: 16,
            background: "#f6f8fa",
            padding: 12,
            borderRadius: 6,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
