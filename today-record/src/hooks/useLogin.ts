import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// 로그인 데이터 타입 정의
export interface LoginData {
  email: string;
  password: string;
}

// 로그인 응답 타입 정의
export interface LoginResponse {
  user: any;
  session: any;
}

// 커스텀 에러 클래스
class LoginError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "LoginError";
  }
}

// 로그인 함수
const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const { email, password } = data;

  // 입력 데이터 검증
  if (!email || !password) {
    throw new LoginError("이메일과 비밀번호를 입력해주세요.");
  }

  try {
    // Supabase Auth를 통한 로그인
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      // Supabase 에러 메시지를 한국어로 변환
      let errorMessage = authError.message;

      if (authError.message.includes("Invalid login credentials")) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (authError.message.includes("Email not confirmed")) {
        errorMessage = "이메일 인증이 필요합니다. 이메일을 확인해주세요.";
      } else if (authError.message.includes("Too many requests")) {
        errorMessage =
          "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      } else if (authError.message.includes("User not found")) {
        errorMessage = "등록되지 않은 이메일입니다.";
      } else if (authError.message.includes("Invalid email")) {
        errorMessage = "올바른 이메일 형식을 입력해주세요.";
      }

      throw new LoginError(errorMessage, authError.message);
    }

    if (!authData.user) {
      throw new LoginError("로그인에 실패했습니다.");
    }

    return authData;
  } catch (error) {
    if (error instanceof LoginError) {
      throw error;
    }

    // 예상치 못한 에러
    console.error("로그인 중 예상치 못한 에러:", error);
    throw new LoginError(
      "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  }
};

// 로그인 훅
export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("로그인 성공:", data.user);
      router.push("/");
    },
    onError: (error: LoginError) => {
      console.error("로그인 실패:", error.message);
    },
  });
};
