// ============================================
//  🛡️ RATE LIMITER — In-memory per IP/session
// ============================================

/**
 * Simple in-memory rate limiter middleware
 * Tracks request counts per IP per time window
 */
function createRateLimiter({
  windowMs = 60 * 1000,   // 1 minute
  maxRequests = 20,        // max 20 requests per window
  message = 'Too many requests',
} = {}) {
  const clients = new Map();

  // Clean up expired entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of clients.entries()) {
      if (now - data.startTime > windowMs) {
        clients.delete(key);
      }
    }
  }, windowMs);

  return (req, res, next) => {
    // Use IP as identifier (fallback to x-forwarded-for for proxied requests)
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.connection?.remoteAddress
      || req.ip
      || 'unknown';

    const now = Date.now();
    const clientData = clients.get(clientIP);

    // 1. Check if user is currently in a "Penalty/Lockout" period
    if (clientData && clientData.lockoutUntil && now < clientData.lockoutUntil) {
      const retryAfter = Math.ceil((clientData.lockoutUntil - now) / 1000);
      setRateLimitHeaders(res, maxRequests, 0, clientData.lockoutUntil - now);
      
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: `${message}. You are temporarily blocked. Please wait ${retryAfter} seconds.`,
        retryAfter,
        limit: maxRequests,
      });
    }

    // 2. Reset window if time expired
    if (!clientData || (now - clientData.startTime > windowMs)) {
      clients.set(clientIP, { count: 1, startTime: now, lockoutUntil: 0 });
      setRateLimitHeaders(res, maxRequests, maxRequests - 1, windowMs);
      return next();
    }

    // 3. Increment request count
    clientData.count++;

    const remaining = Math.max(0, maxRequests - clientData.count);
    const resetTime = clientData.startTime + windowMs;

    setRateLimitHeaders(res, maxRequests, remaining, resetTime - now);

    // 4. Check if limit just got hit
    if (clientData.count > maxRequests) {
      // Penalty: Lock out for a FULL windowMs starting from NOW
      clientData.lockoutUntil = now + windowMs;
      
      const retryAfter = Math.ceil(windowMs / 1000);
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: `${message}. Penalty triggered: wait ${retryAfter} seconds before your next request.`,
        retryAfter,
        limit: maxRequests,
      });
    }

    next();
  };
}

function setRateLimitHeaders(res, limit, remaining, resetMs) {
  res.set({
    'X-RateLimit-Limit': limit,
    'X-RateLimit-Remaining': remaining,
    'X-RateLimit-Reset': Math.ceil(resetMs / 1000),
  });
}

module.exports = { createRateLimiter };
