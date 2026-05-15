-- 001_create_analysis_logs_table.sql
-- 분석 요청 로그를 저장하기 위한 테이블 생성

CREATE TABLE IF NOT EXISTS analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text TEXT NOT NULL,          -- 분석 대상 원문 (민감정보 포함 시 암호화 권장)
  sentiment TEXT NOT NULL,           -- 감성 결과 (positive, negative, neutral)
  confidence INTEGER NOT NULL,       -- 신뢰도 (0-100)
  reason TEXT,                       -- 분석 이유
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_ip TEXT                       -- 사용자 IP (식별 정보이므로 암호화 저장 예정)
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_analysis_logs_sentiment ON analysis_logs(sentiment);
CREATE INDEX IF NOT EXISTS idx_analysis_logs_created_at ON analysis_logs(created_at);
