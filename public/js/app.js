/**
 * public/js/app.js
 * 
 * AI Sentiment Analyzer 프론트엔드 로직
 * - 사용자 입력값 검증 (Validation)
 * - API 호출 (Fetch)
 * - 로딩 상태 및 에러 메시지 처리
 * - 결과 모달 표시 및 제어
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- [1] DOM 요소 선택 ---
  const textarea = document.querySelector("#sentimentText");
  const charCountSpan = document.querySelector("#currentCharCount");
  const analyzeButton = document.querySelector("#analyzeButton");
  const errorMessage = document.querySelector("#errorMessage");

  const modalBackdrop = document.querySelector("#resultModalBackdrop");
  const modalConfirmButton = document.querySelector("#modalConfirmButton");

  const resultLabel = document.querySelector("#resultLabel");
  const resultConfidence = document.querySelector("#resultConfidence");
  const resultReason = document.querySelector("#resultReason");

  // --- [2] 설정 및 상수 ---
  const MAX_CHARS = 1000;
  const sentimentColors = {
    positive: "#00754A", // 긍정: 스타벅스 그린 액센트
    negative: "#c82014", // 부정: 에러 레드
    neutral: "rgba(0,0,0,0.58)" // 중립: 서브 텍스트 색상
  };

  // --- [3] 기능 구현: 글자 수 카운팅 ---
  textarea.addEventListener('input', () => {
    const length = textarea.value.length;
    charCountSpan.textContent = length;
    
    // 1000자 초과 시 시각적 피드백 (HTML 자체에 maxlength가 있지만 한 번 더 체크)
    if (length > MAX_CHARS) {
      charCountSpan.style.color = "var(--color-error)";
    } else {
      charCountSpan.style.color = "var(--color-text-sub)";
    }
  });

  // --- [4] 기능 구현: API 호출 및 상태 관리 ---
  const analyzeSentiment = async () => {
    const text = textarea.value.trim();

    // 입력값 검증 (Validation)
    if (!text) {
      showError("분석할 텍스트를 입력해주세요.");
      return;
    }

    if (text.length > MAX_CHARS) {
      showError("텍스트는 최대 1,000자까지 입력할 수 있습니다.");
      return;
    }

    // 에러 메시지 초기화
    hideError();

    // 로딩 상태 시작
    setLoading(true);

    try {
      // --- 실제 백엔드 API 호출 ---
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "감성 분석 중 문제가 발생했습니다.");
      }

      // 결과 표시
      showResult(result.data);
    } catch (error) {
      console.error("분석 중 오류 발생:", error);
      showError(error.message || "서버와 연결할 수 없습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  // --- [5] 기능 구현: 모달 제어 ---
  const showResult = (data) => {
    const { sentiment, sentimentLabel, confidence, reason } = data;

    // 감성 결과 및 신뢰도 바인딩
    resultLabel.textContent = sentimentLabel;
    resultLabel.style.color = sentimentColors[sentiment] || "var(--color-text-main)";
    resultConfidence.textContent = `신뢰도 ${confidence}%`;
    
    // 분석 이유 바인딩 (줄바꿈 처리)
    resultReason.innerHTML = reason.replace(/\n/g, '<br>');

    // 모달 표시
    modalBackdrop.classList.add('active');
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
  };

  // --- [6] 유틸리티 함수들 ---

  // 에러 메시지 표시
  const showError = (msg) => {
    errorMessage.textContent = msg;
  };

  // 에러 메시지 숨김
  const hideError = () => {
    errorMessage.textContent = "";
  };

  // 로딩 버튼 상태 처리
  const setLoading = (isLoading) => {
    if (isLoading) {
      analyzeButton.disabled = true;
      analyzeButton.textContent = "분석 중...";
    } else {
      analyzeButton.disabled = false;
      analyzeButton.textContent = "감성분석";
    }
  };

  // --- [7] 이벤트 리스너 등록 ---
  analyzeButton.addEventListener('click', analyzeSentiment);
  modalConfirmButton.addEventListener('click', closeModal);

  // 모달 바깥 영역 클릭 시 닫기
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // ESC 키 입력 시 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
});
