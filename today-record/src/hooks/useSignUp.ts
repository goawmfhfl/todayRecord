import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// 회원가입 데이터 타입 정의
export interface SignUpData {
  email: string;
  password: string;
  agreeTerms: boolean;
  agreeAI: boolean;
}

// 회원가입 응답 타입 정의
export interface SignUpResponse {
  user: any;
  session: any;
}

// 커스텀 에러 클래스
class SignUpError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "SignUpError";
  }
}

// 회원가입 함수
const signUpUser = async (data: SignUpData): Promise<SignUpResponse> => {
  const { email, password, agreeTerms, agreeAI } = data;

  // 입력 데이터 검증
  if (!email || !password) {
    throw new SignUpError("이메일과 비밀번호를 입력해주세요.");
  }

  if (!agreeTerms || !agreeAI) {
    throw new SignUpError("필수 약관에 동의해주세요.");
  }

  try {
    // 1. Supabase Auth를 통한 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          agreeTerms,
          agreeAI,
        },
      },
    });

    if (authError) {
      // Supabase 에러 메시지를 한국어로 변환
      let errorMessage = authError.message;

      if (authError.message.includes("already registered")) {
        errorMessage = "이미 가입된 이메일입니다.";
      } else if (authError.message.includes("Invalid email")) {
        errorMessage = "올바른 이메일 형식을 입력해주세요.";
      } else if (authError.message.includes("Password should be")) {
        errorMessage = "비밀번호는 6자 이상이어야 합니다.";
      } else if (authError.message.includes("over_email_send_rate_limit")) {
        errorMessage =
          "이메일 전송이 너무 빈번합니다. 잠시 후 다시 시도해주세요.";
      } else if (authError.message.includes("signup_disabled")) {
        errorMessage = "현재 회원가입이 일시적으로 중단되었습니다.";
      } else if (authError.message.includes("email_not_confirmed")) {
        errorMessage = "이메일 인증이 필요합니다. 이메일을 확인해주세요.";
      }

      throw new SignUpError(errorMessage, authError.message);
    }

    if (!authData.user) {
      throw new SignUpError("회원가입에 실패했습니다.");
    }

    return authData;
  } catch (error) {
    if (error instanceof SignUpError) {
      throw error;
    }

    // 예상치 못한 에러
    console.error("회원가입 중 예상치 못한 에러:", error);
    throw new SignUpError(
      "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  }
};

// 회원가입 훅
export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      console.log("use Mutation 회원가입 성공:", data);

      router.push(
        "/login?message=회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요."
      );
    },
    onError: (error: SignUpError) => {
      console.error("회원가입 실패:", error.message);
    },
  });
};
