import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServiceSupabase } from "@/lib/supabase-service";
import { DailyFeedbackSchema, SYSTEM_PROMPT } from "./schema";
import { DailyFeedbackPayload } from "@/types/Entry";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Records 타입 정의
interface Record {
  id: number;
  user_id: string;
  type: "insight" | "feedback";
  content: string;
  created_at: string;
  kst_date: string;
}

// buildUserPrompt 함수: records 데이터를 프롬프트로 변환
function buildUserPrompt(records: Record[], date: string): string {
  const insights = records.filter((r) => r.type === "insight");
  const feedbacks = records.filter((r) => r.type === "feedback");

  let prompt = `아래는 ${date} 하루의 기록입니다. 위 스키마에 따라 분석하여 JSON만 출력하세요.\n\n`;

  // Insight 섹션
  if (insights.length > 0) {
    prompt += "=== 인사이트 기록 ===\n";
    insights.forEach((record, idx) => {
      prompt += `${idx + 1}. ${record.content}\n`;
    });
    prompt += "\n";
  }

  // Feedback 섹션
  if (feedbacks.length > 0) {
    prompt += "=== 피드백 기록 ===\n";
    feedbacks.forEach((record, idx) => {
      prompt += `${idx + 1}. ${record.content}\n`;
    });
  }

  return prompt;
}

// POST 핸들러
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date } = body;

    if (!userId || !date) {
      return NextResponse.json(
        { error: "userId and date are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Records 데이터 조회
    const supabaseServiceKey = getServiceSupabase();
    const { data: records, error: recordsError } = await supabaseServiceKey
      .from("records")
      .select("*")
      .eq("user_id", userId)
      .eq("kst_date", date);

    if (recordsError) {
      console.error("Records fetch error:", recordsError);
      return NextResponse.json(
        { error: "Failed to fetch records" },
        { status: 500 }
      );
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: "No records found for this date" },
        { status: 404 }
      );
    }

    const userPrompt = buildUserPrompt(records as Record[], date);

    // 4️⃣ OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system", // AI의 역할 정의 (요구사항)
          content: SYSTEM_PROMPT, // "JSON만 출력하고, 스키마 지켜..."
        },
        {
          role: "user", // 실제 데이터 전달
          content: userPrompt, // "아래는 2025-01-21 기록입니다..."
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: DailyFeedbackSchema.name,
          schema: DailyFeedbackSchema.schema,
          strict: DailyFeedbackSchema.strict,
        },
      },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content from OpenAI" },
        { status: 500 }
      );
    }

    // 5️⃣ JSON 파싱
    const feedbackData = JSON.parse(content) as DailyFeedbackPayload;

    // 6️⃣ Supabase daily_feedback 테이블에 저장
    const { data: insertedData, error: insertError } = await supabaseServiceKey
      .from("daily_feedback")
      .insert({
        user_id: userId,
        entry_date: feedbackData.date,
        lesson: feedbackData.lesson,
        keywords: feedbackData.keywords,
        observation: feedbackData.observation,
        insight: feedbackData.insight,
        well_done: feedbackData.action_feedback.well_done,
        to_improve: feedbackData.action_feedback.to_improve,
        focus_tomorrow: feedbackData.focus_tomorrow,
        focus_score: feedbackData.focus_score,
        satisfaction_score: feedbackData.satisfaction_score,
      })
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        {
          error: "Failed to save feedback to database",
          details: insertError.message || String(insertError),
          code: insertError.code,
          hint: insertError.hint,
        },
        { status: 500 }
      );
    }

    if (!insertedData || insertedData.length === 0) {
      return NextResponse.json(
        { error: "Failed to save feedback to database" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Feedback generated and saved successfully",
        data: feedbackData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
