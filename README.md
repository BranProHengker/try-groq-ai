# 🤖 Telegram AI Bot — Powered by Groq

Bot Telegram cerdas yang menggunakan Groq AI (LLaMA 3.3 70B) untuk menjawab pertanyaan.

## ✨ Fitur

- 💬 Chat dengan AI — kirim pesan teks biasa untuk ngobrol
- 🧠 Conversation memory — bot mengingat konteks percakapan
- ⚡ Super cepat — didukung oleh Groq's LPU™ inference engine
- 🔄 Reset percakapan — mulai topik baru kapan saja

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
pnpm install
```

### 2. Konfigurasi `.env`

Pastikan file `.env` sudah berisi API key yang benar:

```env
GROQ_API_KEY=your_groq_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 3. Jalankan bot

```bash
pnpm start
```

## 📖 Command Bot

| Command  | Deskripsi                    |
| -------- | ---------------------------- |
| `/start` | Mulai ulang bot              |
| `/help`  | Tampilkan bantuan            |
| `/reset` | Reset riwayat percakapan     |
| `/model` | Info model AI yang digunakan |

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Package Manager:** pnpm
- **AI:** Groq SDK (LLaMA 3.3 70B Versatile)
- **Telegram:** node-telegram-bot-api


JUST FOR FUN GUYS!