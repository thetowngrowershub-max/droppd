import { env } from '../env';

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory store — fine for a single-instance dev/staging deployment. Move
// to Redis (with a short TTL) before running more than one server instance,
// so verification works regardless of which instance handles the request.
const otpStore = new Map<string, OtpRecord>();

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function requestOtp(phoneE164: string): Promise<void> {
  const code = generateCode();
  otpStore.set(phoneE164, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  await sendSms(phoneE164, code);
}

export function verifyOtpCode(phoneE164: string, submittedCode: string): boolean {
  const record = otpStore.get(phoneE164);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(phoneE164);
    return false;
  }
  record.attempts += 1;
  if (record.attempts > MAX_ATTEMPTS) {
    otpStore.delete(phoneE164);
    return false;
  }
  const isValid = record.code === submittedCode;
  if (isValid) otpStore.delete(phoneE164);
  return isValid;
}

async function sendSms(phoneE164: string, code: string): Promise<void> {
  if (!env.TERMII_API_KEY) {
    // Dev fallback — no SMS provider configured yet.
    console.log(`[otp] ${phoneE164}: ${code} (TERMII_API_KEY not set — logging instead of sending)`);
    return;
  }

  // Termii (https://termii.com) is a common choice for Nigerian A2P SMS/OTP.
  const response = await fetch('https://api.ng.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: phoneE164.replace('+', ''),
      from: env.TERMII_SENDER_ID,
      sms: `Your droppd verification code is ${code}. It expires in 5 minutes.`,
      type: 'plain',
      channel: 'generic',
      api_key: env.TERMII_API_KEY,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send OTP via Termii: ${response.status} ${body}`);
  }
}
