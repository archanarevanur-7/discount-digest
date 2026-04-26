// RFC 5321 max email length
const MAX_EMAIL_LENGTH = 254;

// Reject HTML special characters that have no place in an email address
const HTML_CHARS = /[<>&"']/;

const EDU_PATTERN =
  /^[^\s@]+@[^\s@]+\.(edu|ac\.uk|ac\.nz|edu\.au|ac\.in|edu\.sg|ac\.za|edu\.cn|ac\.jp)$/i;

export function isEduEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length > MAX_EMAIL_LENGTH) return false;
  if (HTML_CHARS.test(trimmed)) return false;
  return EDU_PATTERN.test(trimmed);
}

export function getEduEmailError(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Please enter your email address.";
  if (trimmed.length > MAX_EMAIL_LENGTH) return "That email address is too long.";
  if (HTML_CHARS.test(trimmed)) return "Please use your .edu (or academic) email to unlock personalized deals.";
  if (!trimmed.includes("@")) return "That doesn't look like an email address.";
  if (!isEduEmail(trimmed))
    return "Please use your .edu (or academic) email to unlock personalized deals.";
  return null;
}
