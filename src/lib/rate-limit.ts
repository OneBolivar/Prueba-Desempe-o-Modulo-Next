interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitTracker>();

export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60 * 1000
): { isAllowed: boolean; remaining: number } {
  const now = Date.now();
  const clientData = rateLimitMap.get(identifier);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { isAllowed: true, remaining: limit - 1 };
  }

  if (clientData.count >= limit) {
    return { isAllowed: false, remaining: 0 };
  }

  clientData.count += 1;
  return { isAllowed: true, remaining: limit - clientData.count };
}