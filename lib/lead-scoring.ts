const freeEmailDomains = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com"
]);

export function calculateLeadScore(email: string) {
  let score = 0;
  const normalizedEmail = email.trim().toLowerCase();
  const emailParts = normalizedEmail.split("@");

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    score += 20;
  }

  if (emailParts.length === 2 && !freeEmailDomains.has(emailParts[1])) {
    score += 30;
  }

  return score;
}
