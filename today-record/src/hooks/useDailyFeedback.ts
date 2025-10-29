import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { QUERY_KEYS, API_ENDPOINTS } from "@/constants";
import { getCurrentUserId } from "./useCurrentUser";
import { DailyFeedbackPayload } from "@/types/Entry";

// Daily Feedback 조회 함수
const fetchDailyFeedback = async (
  date: string
): Promise<DailyFeedbackPayload | null> => {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from(API_ENDPOINTS.DAILY_FEEDBACK)
      .select("*")
      .eq("user_id", userId)
      .eq("entry_date", date)
      .single();

    if (error) {
      // 데이터가 없는 경우 null 반환 (에러가 아닌 빈 상태)
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    // Supabase 데이터를 DailyFeedbackPayload 타입으로 변환
    return {
      date: data.entry_date,
      lesson: data.lesson || "",
      keywords: data.keywords || [],
      observation: data.observation || "",
      insight: data.insight || "",
      action_feedback: {
        well_done: data.well_done || "",
        to_improve: data.to_improve || "",
      },
      focus_tomorrow: data.focus_tomorrow || "",
      focus_score: data.focus_score || 0,
      satisfaction_score: data.satisfaction_score || 0,
    };
  } catch (error) {
    console.error("일일 피드백 조회 중 오류:", error);
    throw error;
  }
};

// Daily Feedback 조회 훅
export const useDailyFeedback = (date: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DAILY_FEEDBACK, date],
    queryFn: () => fetchDailyFeedback(date),
    enabled: !!date, // date가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
