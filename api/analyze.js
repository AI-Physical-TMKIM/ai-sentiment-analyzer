/**
 * api/analyze.js
 * 
 * 백엔드 API 서버 (Express 기반)
 * - 사용자로부터 텍스트를 전달받아 OpenAI API를 호출합니다.
 * - 감성 분석 결과를 정제하여 반환합니다.
 */

const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 정적 파일(HTML, CSS, JS) 서비스

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * [POST] /api/analyze
 * 텍스트 감성 분석 요청 처리
 */
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  // [1] 입력값 검증
  if (!text || text.trim() === "") {
    return res.status(400).json({ 
      success: false, 
      message: "분석할 텍스트를 입력해주세요." 
    });
  }

  if (text.length > 1000) {
    return res.status(400).json({ 
      success: false, 
      message: "텍스트는 최대 1,000자까지 입력할 수 있습니다." 
    });
  }

  try {
    // [2] OpenAI API 호출 또는 Mock 모드 (테스트용)
    let result;
    if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here' || !process.env.OPENAI_API_KEY) {
      console.log("[테스트 모드] OpenAI API 키가 없으므로 Mock 데이터를 사용합니다.");
      result = {
        sentiment: "positive",
        sentimentLabel: "긍정",
        confidence: 95,
        reason: "이것은 테스트용 Mock 데이터입니다. Supabase 연동을 테스트하고 있습니다."
      };
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `당신은 텍스트 감성 분석 전문가입니다. 
            사용자의 문장을 분석하여 반드시 다음 JSON 형식으로만 응답하세요.
            {
              "sentiment": "positive" | "negative" | "neutral",
              "sentimentLabel": "긍정" | "부정" | "중립",
              "confidence": 0-100 사이의 정수,
              "reason": "분석 이유 (한국어로 2~3문장)"
            }`
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" }
      });
      result = JSON.parse(response.choices[0].message.content);
    }

    // [4] 데이터베이스 저장 및 보안 처리 (Phase 4)
    try {
      const supabase = require('../lib/supabase');
      const { encrypt } = require('../lib/crypto');

      // 사용자 식별 정보(IP) 암호화
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const encryptedIp = encrypt(clientIp);

      const { error: dbError } = await supabase
        .from('analysis_logs')
        .insert([
          {
            input_text: text, // 필요 시 이것도 암호화 가능 (encrypt(text))
            sentiment: result.sentiment,
            confidence: result.confidence,
            reason: result.reason,
            user_ip: encryptedIp // 식별 정보 암호화 저장
          }
        ]);

      if (dbError) {
        console.error("Supabase 저장 중 오류 발생 (로그만 기록):", dbError.message);
        // 사용자에게는 성공 응답을 보내되, 서버 로그만 남깁니다.
      }
    } catch (dbCatchError) {
      console.error("데이터베이스 연동 실패 (로그만 기록):", dbCatchError);
    }

    // [5] 최종 결과 반환
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    res.status(500).json({ 
      success: false, 
      message: "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." 
    });
  }
});

// 서버 시작 (로컬 환경에서만 실행)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });
}

// Vercel 서버리스 함수로 동작하기 위해 앱 인스턴스 내보내기
module.exports = app;
