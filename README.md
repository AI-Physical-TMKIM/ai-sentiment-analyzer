# AI Sentiment Analyzer ☕️

AI를 활용하여 문장의 감성을 분석하고 시각적으로 보여주는 웹 서비스입니다. 
스타벅스풍의 따뜻하고 신뢰감 있는 디자인 시스템을 적용하여 사용자에게 편안한 경험을 제공합니다.

## 🚀 주요 기능

- **실시간 감성 분석**: OpenAI API(GPT-3.5)를 활용하여 입력된 텍스트의 긍정, 부정, 중립 상태를 분석합니다.
- **상세 분석 결과**: 감성 레이블뿐만 아니라 신뢰도(%)와 AI가 분석한 구체적인 이유를 모달창으로 제공합니다.
- **디자인 시스템**: 따뜻한 크림색 배경과 그린 액센트 컬러를 활용한 프리미엄 UI/UX.
- **보안 및 데이터 로깅**: 분석 결과를 Supabase에 기록하며, 사용자 식별 정보(IP 등)는 AES-256 알고리즘으로 암호화하여 안전하게 저장합니다.
- **반응형 웹**: 모바일과 데스크톱 환경 모두에 최적화된 레이아웃을 제공합니다.

## 🛠 기술 스택

- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **AI**: OpenAI API
- **Database**: Supabase
- **Security**: Crypto (AES-256-CBC)

## 📦 설치 및 실행 방법

1. **저장소 클론**
   ```bash
   git clone https://github.com/AI-Physical-TMKIM/ai-sentiment-analyzer.git
   cd ai-sentiment-analyzer
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   - `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.
   - 각 항목에 맞는 API 키를 입력합니다.
   ```text
   OPENAI_API_KEY=your_key
   SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_key
   ```

4. **데이터베이스 설정**
   - `supabase/migrations/001_create_analysis_logs_table.sql` 파일의 쿼리를 Supabase SQL Editor에서 실행합니다.

5. **서버 실행**
   ```bash
   node api/analyze.js
   ```
   - 이제 `http://localhost:3000`에서 서비스를 이용할 수 있습니다.

## 🎨 디자인 가이드

- **Background**: Warm Cream (`#f2f0eb`)
- **Primary Color**: Starbucks Green Accent (`#00754A`)
- **Typography**: Inter, Manrope
- **Component**: 50px Pill Buttons, 12px Rounded Cards

---
**Author**: AI-Physical-TMKIM
