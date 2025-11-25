/**
 * Helper functions to detect authentication types
 */

/**
 * Check if email is a Google account
 */
export const isGoogleEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith("@gmail.com");
};

/**
 * Check if email is a Microsoft account (Hotmail, Outlook, Live, MSN)
 */
export const isMicrosoftEmail = (email: string): boolean => {
  const emailLower = email.toLowerCase();
  return (
    emailLower.endsWith("@hotmail.com") ||
    emailLower.endsWith("@outlook.com") ||
    emailLower.endsWith("@live.com") ||
    emailLower.endsWith("@msn.com")
  );
};

/**
 * Check if email requires OAuth authentication
 */
export const isOAuthEmail = (email: string): boolean => {
  return isGoogleEmail(email) || isMicrosoftEmail(email);
};

/**
 * Get OAuth provider for email
 */
export const getOAuthProvider = (
  email: string
): "google" | "microsoft" | null => {
  if (isGoogleEmail(email)) return "google";
  if (isMicrosoftEmail(email)) return "microsoft";
  return null;
};

/**
 * Check if email requires password-based auth with OTP
 */
export const requiresPasswordAuth = (email: string): boolean => {
  return !isOAuthEmail(email);
};
