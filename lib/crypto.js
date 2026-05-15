/**
 * ai-sentiment-analyzer/lib/crypto.js
 * 
 * 보안을 위한 데이터 암호화/복호화 모듈 (Node.js 기본 crypto 모듈 사용)
 * 글로벌 규칙: 사용자를 식별할 수 있는 정보는 반드시 암호화하여 저장합니다.
 */

const crypto = require('crypto');
require('dotenv').config();

// 암호화에 사용할 키와 알고리즘 (실제 서비스에서는 32바이트 길이의 강력한 키를 환경변수로 관리해야 합니다)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'a_very_secret_key_32_characters_!!'; 
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * 텍스트 암호화
 */
function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * 텍스트 복호화
 */
function decrypt(text) {
  if (!text) return text;
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).substring(0, 32)), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
