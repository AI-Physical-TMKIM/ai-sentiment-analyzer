/**
 * ai-sentiment-analyzer/lib/supabase.js
 * 
 * Supabase 연동 클라이언트 설정
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase 설정(URL 또는 Key)이 환경 변수에 누락되었습니다.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
