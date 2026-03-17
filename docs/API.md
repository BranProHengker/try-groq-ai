# 🌐 Eatsuki API Documentation

Base URL: `http://localhost:3000`

---

## 🟢 Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "name": "Eatsuki API",
  "version": "2.0.0",
  "timestamp": "2026-03-17T07:46:14.970Z"
}
```

---

## 💬 Chat — Send Message

```
POST /api/chat
Content-Type: application/json
```

**Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | ✅ | Unique session ID (like a chat room) |
| `message` | string | ✅ | User's message text |
| `userName` | string | ❌ | User's display name (default: "Guest") |

> **Tip:** If `userName` matches the owner username, Itsuki will treat them as her boyfriend (Bran-kun).

**Example Request (Postman):**
```json
{
  "sessionId": "user-123",
  "message": "Halo Itsuki! Apa kabar?",
  "userName": "branzcreed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Konnichiwa, Bran-kun! 🌟 Mou~, apa yang kamu lakukan hari ini?",
    "mood": {
      "key": "normal",
      "label": "🌟 Normal"
    },
    "sessionId": "user-123"
  }
}
```

---

## 🔄 Chat — Reset History

```
POST /api/chat/reset
Content-Type: application/json
```

**Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | ✅ | Session to reset |

**Response:**
```json
{
  "success": true,
  "message": "Chat history has been reset",
  "sessionId": "user-123"
}
```

---

## 🍖 Food Recommendation

```
GET /api/food
```

Returns a random food based on current time of day.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Burger Double Cheese",
    "emoji": "🍔",
    "comment": "Burgers are... one of the best foods in the world desu!",
    "category": "makan_siang",
    "timePeriod": "siang"
  }
}
```

---

## 📸 Random GIF

```
GET /api/gif
GET /api/gif?category=happy
```

**Query Parameters:**
| Param | Type | Required | Options |
|-------|------|----------|---------|
| `category` | string | ❌ | `happy`, `eating`, `angry`, `cute`, `blush` |

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://media1.tenor.com/m/_4-_lF8oRmUAAAAC/itsuki-nakano.gif",
    "comment": "Hehe~ am I cute? ...N-not that I said it! 😤",
    "category": "random",
    "availableCategories": ["happy", "eating", "angry", "cute", "blush"]
  }
}
```

---

## 😤 Mood

```
GET /api/mood/:sessionId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "lapar",
    "label": "🍖 Hungry",
    "prompt": "You are HUNGRY! Mention food in every answer...",
    "timePeriod": "siang",
    "sessionId": "user-123"
  }
}
```

**Mood Values:**
| Key | Label | When |
|-----|-------|------|
| `energik` | ⚡ Energetic | 5am - 8am |
| `senang` | 😊 Happy | 8am - 11am |
| `lapar` | 🍖 Hungry | 11am-12pm, 5pm-6pm |
| `normal` | 🌟 Normal | Default |
| `ngantuk` | 😴 Sleepy | 10pm - 4am |
| `ngambek` | 😤 Pouting | No chat > 6 hours |

---

## 📊 Chat Statistics

```
GET /api/stats/:sessionId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formatted": "📊 Chat Statistics — User 📊\n💬 Total Messages: 5\n...",
    "sessionId": "user-123"
  }
}
```

---

## 👤 Character Info

```
GET /api/character
```

Returns Itsuki's full character data (name, appearance, family, favorites, etc).

---

## 🧠 Model Info

```
GET /api/model
```

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": "Groq",
    "model": "llama-3.3-70b-versatile",
    "maxTokens": 2048,
    "temperature": 0.7
  }
}
```

---

## ⚠️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Missing required fields |
| `404` | Route not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## 🛡️ Rate Limiting

All API endpoints are rate-limited per IP address.

| Scope | Limit | Window |
|-------|-------|--------|
| All `/api/*` endpoints | **25 requests** | per minute |
| `/api/chat` (POST) | **20 requests** | per minute |

**Response Headers** (included in every response):
```
X-RateLimit-Limit: 25
X-RateLimit-Remaining: 23
X-RateLimit-Reset: 45
```

**429 Error Response:**
```json
{
  "success": false,
  "error": "Rate Limit Exceeded",
  "message": "Chat rate limit exceeded — Itsuki needs a break! 😤. Please wait 23 seconds before trying again.",
  "retryAfter": 23,
  "limit": 20,
  "windowMs": 60000
}
```

---

## 🚀 Running the API

```bash
# Start API server
pnpm api
# or
node src/api/server.js

# Default port: 3000
# Custom port: API_PORT=8080 node src/api/server.js
```
