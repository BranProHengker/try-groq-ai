# 🍜 Eatsuki AI — Nakano Itsuki AI Bot

![Itsuki Banner](https://media1.tenor.com/m/_4-_lF8oRmUAAAAC/itsuki-nakano-the-quintessential-quintuplets.gif)

**Eatsuki AI** is a premium, character-driven AI bot based on **Nakano Itsuki** from *The Quintessential Quintuplets*. Powered by **Groq AI (LLaMA 3.3 70B)**, this bot features a complex personality system, persistent memory, and multiple interfaces (Telegram, CLI, and REST API).

---

## ✨ Features

- 🧠 **Smart Context Memory**: Remembers your previous chats across sessions.
- 😤 **Dynamic Mood System**: Itsuki's personality changes based on time, hunger, and interaction frequency.
- 🍖 **Food Recommendations**: Personalized food suggestions based on the time of day.
- 📊 **Chat Statistics**: Track your interaction stats (messages, words, first/last chat).
- 📸 **Itsuki GIFs**: Get random expressive GIFs from Tenor.
- 🌐 **Internationalized**: Automatically detects and responds in your language (English/Indonesian).
- 🖥️ **Premium CLI**: A beautiful, terminal-based chat interface inspired by Claude Code.
- 🌐 **REST API**: Full-featured API to integrate Itsuki into your own web applications.

---

## 🚀 Getting Started

### 1. Installation

```bash
pnpm install
```

### 2. Configuration (`.env`)

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OWNER_USERNAME=branzcreed
```

### 3. Usage

| Interface | Command | Description |
|-----------|---------|-------------|
| **Telegram Bot** | `pnpm start` | Run the main Telegram bot |
| **CLI Chat** | `pnpm chat` | Chat with Itsuki in your Terminal |
| **REST API** | `pnpm api` | Start the Express server on port 3000 |

---

## 📂 Project Structure

Restructured into a clean, modular architecture:

```
src/
├── api/        # REST API Server & Routes
├── cli/        # Terminal Interface (CLI)
├── core/       # AI Engine, Character Prompt, & Config
├── features/   # Food, GIFs, Mood, & Stats logic
├── storage/    # Persistence layer (History management)
└── telegram/   # Telegram Bot handlers & commands
```

---

## 📡 REST API (v2.0)

Eatsuki is now accessible via REST API for web developers.
Full documentation available in [docs/API.md](./docs/API.md).

**Key Endpoints:**
- `POST /api/chat` - Ngobrol dengan Itsuki
- `GET  /api/food` - Ambil rekomendasi makanan
- `GET  /api/gif` - Ambil random Itsuki GIF
- `GET  /api/stats/:sessionId` - Lihat statistik chat

**🛡️ Rate Limiting:**
- Global: 25 requests / min
- Chat: 20 requests / min

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **AI Engine:** Groq SDK (LLaMA 3.3 70B Versatile)
- **Telegram SDK:** `node-telegram-bot-api`
- **Backend:** Express.js + CORS
- **Style:** Chalk (for CLI aesthetics)
- **Package Manager:** pnpm

---

## 📖 Bot Commands

- `/foods` — Get food recommendations 🍖
- `/itsuki` — Send an Itsuki GIF~! 📸
- `/stats` — Your chat statistics 📊
- `/reset` — Clear chat history
- `/about` — About Itsuki Nakano
- `/help` — Show all available commands

---

### Special Thanks
Dedicated to all Nakano Itsuki fans! 😤💕🍜

**Created with ❤️ by [avttr-studio](https://github.com/branzcreed)**