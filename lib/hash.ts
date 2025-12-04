import crypto from "crypto"

/**
 * Hash user ID for anonymous storage in likes/comments
 * This ensures we can track user actions without exposing identity
 */
export function hashUserId(userId: string): string {
  return crypto
    .createHash("sha256")
    .update(userId + process.env.NEXTAUTH_SECRET!)
    .digest("hex")
    .substring(0, 16)
}

