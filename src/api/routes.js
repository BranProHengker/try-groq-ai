// ============================================
//  🌐  REST API — Routes
// ============================================

const { getAIResponse, resetHistory, getUserName, isOwner, getTimePeriod } = require('../core/ai');
const { CHARACTER_DATA } = require('../core/character');
const { AI_MODEL, AI_MAX_TOKENS, AI_TEMPERATURE, OWNER_USERNAME } = require('../core/config');
const { getRandomFood, formatFoodRecommendation } = require('../features/food');
const { getRandomGif, getRandomComment, GIF_COLLECTION } = require('../features/gifs');
const { getMoodInfo } = require('../features/mood');
const { getFormattedStats, recordMessage } = require('../features/stats');

/**
 * Build a mock msg object for the AI engine
 * (the AI module expects a Telegram-style msg object)
 */
function buildMockMsg(sessionId, userName) {
  const isOwnerUser = userName?.toLowerCase() === OWNER_USERNAME?.toLowerCase();
  return {
    from: {
      username: isOwnerUser ? OWNER_USERNAME : userName || 'web-user',
      first_name: userName || 'Guest',
    },
    chat: { id: sessionId },
  };
}

/**
 * Register all API routes
 * @param {import('express').Express} app
 */
function registerRoutes(app) {

  // ─── Health Check ──────────────────────────
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      name: 'Eatsuki API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // ─── Chat (Send Message) ──────────────────
  app.post('/api/chat', async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({
          success: false,
          error: 'Missing Request Body',
          message: 'Please ensure you are sending a JSON body with "Content-Type: application/json"',
        });
      }

      const { sessionId, message, userName } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['sessionId', 'message'],
          optional: ['userName'],
        });
      }

      const mockMsg = buildMockMsg(sessionId, userName);
      const response = await getAIResponse(sessionId, message, mockMsg);

      const timePeriod = getTimePeriod();
      const moodInfo = getMoodInfo(sessionId, timePeriod);

      res.json({
        success: true,
        data: {
          response,
          mood: {
            key: moodInfo.key,
            label: moodInfo.label,
          },
          sessionId,
        },
      });
    } catch (error) {
      console.error('❌ API Chat Error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Failed to get AI response',
        message: error.message,
      });
    }
  });

  // ─── Chat Reset ────────────────────────────
  app.post('/api/chat/reset', (req, res) => {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: 'Missing Request Body',
      });
    }
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'Missing required field: sessionId',
      });
    }

    resetHistory(sessionId);

    res.json({
      success: true,
      message: 'Chat history has been reset',
      sessionId,
    });
  });

  // ─── Food Recommendation ──────────────────
  app.get('/api/food', (req, res) => {
    const timePeriod = getTimePeriod();
    const food = getRandomFood(timePeriod);

    res.json({
      success: true,
      data: {
        name: food.name,
        emoji: food.emoji,
        comment: food.comment,
        category: food.category,
        timePeriod,
      },
    });
  });

  // ─── Random GIF ────────────────────────────
  app.get('/api/gif', (req, res) => {
    const { category } = req.query;
    const gifUrl = getRandomGif(category || null);
    const comment = getRandomComment();

    res.json({
      success: true,
      data: {
        url: gifUrl,
        comment,
        category: category || 'random',
        availableCategories: Object.keys(GIF_COLLECTION),
      },
    });
  });

  // ─── Mood ──────────────────────────────────
  app.get('/api/mood/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const timePeriod = getTimePeriod();
    const moodInfo = getMoodInfo(sessionId, timePeriod);

    res.json({
      success: true,
      data: {
        ...moodInfo,
        timePeriod,
        sessionId,
      },
    });
  });

  // ─── Stats ─────────────────────────────────
  app.get('/api/stats/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const formatted = getFormattedStats(sessionId, 'User');

    res.json({
      success: true,
      data: {
        formatted,
        sessionId,
      },
    });
  });

  // ─── Character Info ────────────────────────
  app.get('/api/character', (req, res) => {
    res.json({
      success: true,
      data: CHARACTER_DATA,
    });
  });

  // ─── Model Info ────────────────────────────
  app.get('/api/model', (req, res) => {
    res.json({
      success: true,
      data: {
        provider: 'Groq',
        model: AI_MODEL,
        maxTokens: AI_MAX_TOKENS,
        temperature: AI_TEMPERATURE,
      },
    });
  });
}

module.exports = { registerRoutes };
