"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>이용약관 및 개인정보 수집·이용 동의</DialogTitle>
        </DialogHeader>
        <DialogDescription
          className="space-y-4"
          style={{ color: "#333333", lineHeight: "1.7" }}
        >
          <div>
            <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
              제1조 (목적)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
              본 약관은 myRecord(이하 &quot;서비스&quot;)가 제공하는 기록 및 AI
              피드백 기능을 이용함에 있어, 이용자와 서비스 운영자 간의
              권리·의무를 규정함을 목적으로 합니다.
            </p>
          </div>
          <div>
            <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
              제2조 (수집하는 개인정보 항목)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
              서비스는 회원가입 및 기록 피드백 제공을 위해 아래 정보를
              수집합니다.
              {/* 모바일용 간단한 카드 레이아웃 */}
              <div className="block md:hidden mt-4 space-y-2">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      필수
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">수집 항목:</span> 이메일,
                      비밀번호, 닉네임
                    </div>
                    <div>
                      <span className="font-medium">수집 목적:</span> 회원 식별,
                      로그인, 계정 관리
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      선택
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">수집 항목:</span> 생년, 성별
                    </div>
                    <div>
                      <span className="font-medium">수집 목적:</span> 개인화
                      피드백 제공
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      자동 수집
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">수집 항목:</span> 접속기기
                      정보, 이용 로그, 쿠키
                    </div>
                    <div>
                      <span className="font-medium">수집 목적:</span> 서비스
                      안정성 및 품질 개선
                    </div>
                  </div>
                </div>
              </div>
              {/* 태블릿/데스크탑용 깔끔한 테이블 레이아웃 */}
              <div className="hidden md:block mt-4">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                          구분
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                          수집 항목
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                          수집 목적
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          필수
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          이메일, 비밀번호, 닉네임
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          회원 식별, 로그인, 계정 관리
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          선택
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          생년, 성별
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          개인화 피드백 제공
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          수집
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          접속기기 정보, 이용 로그, 쿠키
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          서비스 안정성 및 품질 개선
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </p>
          </div>
          <div>
            <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
              제3조 (개인정보의 이용 목적)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
              수집된 개인정보는 아래 목적으로 이용됩니다.
              <br /> 1. 회원 식별 및 서비스 제공
              <br /> 2. 기록 데이터 저장 및 피드백 분석
              <br /> 3. 서비스 개선 및 신규 기능 개발
              <br /> 4. 고객 문의 대응 및 공지사항 전달
            </p>
          </div>
          <div>
            <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
              제4조 (보관 및 파기)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
              - 회원 탈퇴 시 모든 개인정보는 즉시 삭제됩니다.
              <br /> - 단, 법령상 보존이 필요한 경우 관련 법령에 따라 일정 기간
              보관 후 파기합니다.
            </p>
          </div>

          <div>
            <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
              제5조 (이용자의 권리)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
              이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제를 요청할 수
              있으며, 문의 메일을 통해 요청할 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="mb-2" style={{ fontSize: "0.95rem" }}>
              제6조 (기타)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#4E4B46" }}>
              기타 개인정보 처리에 관한 세부 내용은 별도의 「개인정보
              처리방침」에 따릅니다.
            </p>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
