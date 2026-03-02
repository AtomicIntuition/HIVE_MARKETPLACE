import { randomBytes, createHash } from "crypto";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const KEY_PREFIX = "hm_sk_";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const raw = randomBytes(32).toString("hex");
  const key = `${KEY_PREFIX}${raw}`;
  const hash = hashKey(key);
  const prefix = `${KEY_PREFIX}${raw.slice(0, 8)}...`;
  return { key, hash, prefix };
}

interface ValidateResult {
  valid: boolean;
  userId?: string;
  keyId?: string;
}

export async function validateApiKey(authHeader: string | null): Promise<ValidateResult> {
  if (!authHeader) return { valid: false };

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token || !token.startsWith(KEY_PREFIX)) return { valid: false };

  const hash = hashKey(token);

  const [row] = await db
    .select({ id: apiKeys.id, userId: apiKeys.userId, status: apiKeys.status })
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, hash), eq(apiKeys.status, "active")))
    .limit(1);

  if (!row) return { valid: false };

  // Fire-and-forget: update lastUsedAt
  db.update(apiKeys)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKeys.id, row.id))
    .then(() => {})
    .catch(() => {});

  return { valid: true, userId: row.userId, keyId: row.id };
}
