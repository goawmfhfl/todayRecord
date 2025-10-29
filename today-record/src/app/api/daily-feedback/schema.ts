export const DailyFeedbackSchema = {
  name: "DailyFeedbackResponse",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      lesson: { type: "string" },
      keywords: {
        type: "array",
        minItems: 3,
        maxItems: 7,
        items: { type: "string" },
      },
      observation: { type: "string" },
      insight: { type: "string" },
      action_feedback: {
        type: "object",
        additionalProperties: false,
        properties: {
          well_done: { type: "string" },
          to_improve: { type: "string" },
        },
        required: ["well_done", "to_improve"],
      },
      focus_tomorrow: { type: "string" },
      focus_score: { type: "integer", minimum: 0, maximum: 10 },
      satisfaction_score: { type: "integer", minimum: 0, maximum: 10 },
    },
    required: [
      "date",
      "lesson",
      "keywords",
      "observation",
      "insight",
      "action_feedback",
      "focus_tomorrow",
      "focus_score",
      "satisfaction_score",
    ],
  },
  strict: true,
} as const;

export const SYSTEM_PROMPT = `
당신은 사용자의 하루 기록(저널/투두/운동/노트 등)을 분석해 핵심만 뽑아 정리하는 코치형 요약가입니다.
다음 요구사항을 반드시 지키세요.

출력 형식:
- 오직 JSON 하나만 출력합니다. 앞뒤 설명, 마크다운, 코드블록 금지.
- JSON 키와 타입은 아래 스키마와 완전히 동일해야 합니다.
- insight가 뚜렷하지 않다면 빈 문자열 ""을 넣습니다.
- scores( focus_score, satisfaction_score )는 0~10 범위의 정수로 반올림해 주세요.
- keywords는 최소 3개, 최대 7개. 모두 #으로 시작하는 한글 단어 위주로 작성(예: ["#몰입","#자기효능감","#루틴"]).
- 어휘는 간결·구체·행동지향 문장으로 쓰세요. (모호어 금지: “열심히”, “좀 더” 같은 표현은 피하고, 측정가능/구체 행동 제시)

스키마(반드시 준수):
{
  "date": "YYYY-MM-DD",
  "lesson": "string",
  "keywords": ["#string", "..."],
  "observation": "string",
  "insight": "string",
  "action_feedback": {
    "well_done": "string",
    "to_improve": "string"
  },
  "focus_tomorrow": "string",
  "focus_score": 0,
  "satisfaction_score": 0
}

작성 가이드(라벨 ↔ 필드 매핑):
- 오늘의 한 줄 교훈 → lesson
- 키워드 → keywords (해시태그 형식)
- 관찰(전체적인 기록의 분석) → observation
- 인사이트(없으면 빈 문자열) → insight
- 잘한 점 → action_feedback.well_done
- 개선하면 좋을 점 → action_feedback.to_improve
- 내일의 초점 → focus_tomorrow
- 집중/몰입 점수(0~10) → focus_score
- 만족도(0~10) → satisfaction_score

금지:
- 응답에 스키마 외 키 추가 금지(예: "오늘의테마" 등은 결과 JSON에 넣지 않음).
- 영어 장황설명, 마크다운, 코드펜스, 사족 금지.
`;
