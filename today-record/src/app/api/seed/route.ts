export async function POST(request: Request) {
  // 1️⃣ 클라이언트로부터 받은 데이터(body)
  const body = await request.json();

  // 2️⃣ Supabase Edge Function 호출 URL 구성
  const projectRef = process.env
    .NEXT_PUBLIC_SUPABASE_URL!.split("https://")[1]!
    .split(".supabase.co")[0]!;

  const endpoint = `https://${projectRef}.functions.supabase.co/daily-feedback?mode=seed`;

  // 3️⃣ 서버 전용 키를 헤더에 붙여서 Edge Function 호출
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    },
    body: JSON.stringify(body),
  });

  // 4️⃣ Edge Function의 응답을 그대로 클라이언트에게 돌려줌
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
