// ============================================
//  🌐   REST API — Server
// ============================================

const express = require('express');
const cors = require('cors');
const { createRateLimiter } = require('./rateLimit');
const { registerRoutes } = require('./routes');

const app = express();
const PORT = process.env.API_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Global rate limiter: 25 requests per minute per IP
app.use('/api', createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 25,
  message: 'Too many requests from this IP',
}));

// Stricter limit for chat endpoint (calls Groq API): 20 requests per minute
app.use('/api/chat', createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Chat rate limit exceeded — Itsuki needs a break! 😤',
}));

// Register API routes
registerRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    availableEndpoints: [
      'GET  /api/health',
      'POST /api/chat',
      'POST /api/chat/reset',
      'GET  /api/food',
      'GET  /api/gif',
      'GET  /api/gif?category=happy|eating|angry|cute|blush',
      'GET  /api/mood/:sessionId',
      'GET  /api/stats/:sessionId',
      'GET  /api/character',
      'GET  /api/model',
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🌐 ═══════════════════════════════════════');
  console.log(`   Eatsuki API running on port ${PORT}`);
  console.log('   Nakano Itsuki 🌟 Powered by avttr-studio');
  console.log('🌐 ═══════════════════════════════════════');
  console.log('');
  console.log(`📡 http://localhost:${PORT}/api/health`);
  console.log('   Press Ctrl+C to stop');
  console.log('');
});

module.exports = app;
