import { createClient } from "@supabase/supabase-js";

// 서비스 키를 사용한 Supabase 클라이언트 (RLS 우회)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseServiceKeyClient = createClient(
  supabaseUrl!,
  supabaseServiceKey!
);

export { supabaseServiceKeyClient as supabaseServiceKey };
