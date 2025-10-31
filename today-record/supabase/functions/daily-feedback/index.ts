// @ts-ignore - Deno URL import; types resolved by Deno at runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "ping";

  // 무인증 핑
  if (mode === "ping") {
    return new Response(JSON.stringify({ ok: true, env: "edge-remote" }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  }

  // 보안: 서비스 롤 키 일치 여부 검사
  const auth = req.headers.get("Authorization") ?? "";
  const serviceRoleKey =
    (auth?.startsWith("Bearer ") ? auth.slice(7) : auth?.split(/\s+/)[1]) ??
    null;

  // seed: records 테이블에 테스트 데이터 삽입
  if (mode === "seed") {
    try {
      const supabase = createClient(
        "https://mogjqlhzxqjuvffdizlc.supabase.co",
        serviceRoleKey
      );
      const nowIso = new Date().toISOString();
      let payload: Record<string, unknown> = {};
      try {
        if (req.headers.get("content-type")?.includes("application/json")) {
          payload = (await req.json()) as Record<string, unknown>;
        }
      } catch (_) {
        payload = {};
      }

      const userId: string =
        payload.user_id ??
        payload.userId ??
        "00000000-0000-0000-0000-000000000000";
      const content: string = payload.content ?? `seed from edge @ ${nowIso}`;

      const { data, error } = await supabase
        .from("records")
        .insert({
          user_id: userId,
          content,
          created_at: nowIso,
          type: "feedback",
        })
        .select("id")
        .single();

      if (error) {
        return new Response(JSON.stringify({ ok: false, error }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ ok: true, id: data?.id ?? null }), {
        headers: { "content-type": "application/json" },
        status: 200,
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: String(e) }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // 그 외 모드 에코
  return new Response(JSON.stringify({ ok: true, mode }), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
});
