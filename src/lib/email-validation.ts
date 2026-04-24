const EDU_PATTERN =
  /^[^\s@]+@[^\s@]+\.(edu|ac\.uk|ac\.nz|edu\.au|ac\.in|edu\.sg|ac\.za|edu\.cn|ac\.jp)$/i;

export function isEduEmail(email: string): boolean {
  return EDU_PATTERN.test(email.trim());
}

export function getEduEmailError(email: string): string | null {
  if (!email.trim()) return "Please enter your email address.";
  if (!email.includes("@")) return "That doesn't look like an email address.";
  if (!isEduEmail(email))
    return "Please use your .edu (or academic) email to unlock personalized deals.";
  return null;
}
