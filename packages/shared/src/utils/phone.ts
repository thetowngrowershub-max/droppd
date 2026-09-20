// Nigerian phone numbers: +234 followed by 10 digits (local numbers drop the leading 0).
// e.g. local 0801 234 5678 -> +2348012345678

const NG_MOBILE_REGEX = /^\+234[789][01]\d{8}$/;

export function isValidNigerianPhone(e164: string): boolean {
  return NG_MOBILE_REGEX.test(e164);
}

export function toE164Nigeria(localOrE164: string): string {
  const digits = localOrE164.replace(/[^\d+]/g, '');
  if (digits.startsWith('+234')) return digits;
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

export function formatNigerianPhoneForDisplay(e164: string): string {
  // +2348012345678 -> 0801 234 5678
  const match = e164.match(/^\+234(\d{3})(\d{3})(\d{4})$/);
  if (!match) return e164;
  return `0${match[1]} ${match[2]} ${match[3]}`;
}
