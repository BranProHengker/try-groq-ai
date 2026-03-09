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

## 🚀 Deployment (Agar Bot Online 24/7)

Agar bot berjalan terus tanpa harus buka terminal, kamu bisa deploy ke salah satu layanan berikut:

### Opsi 1: Railway (Rekomendasi — Gratis untuk project kecil)

1. Buat akun di [railway.app](https://railway.app)
2. Buat project baru → pilih "Deploy from GitHub Repo" atau "Empty Project"
3. Upload / connect repo kamu
4. Tambahkan environment variables (`GROQ_API_KEY` dan `TELEGRAM_BOT_TOKEN`) di Settings → Variables
5. Railway akan otomatis menjalankan `pnpm start`

### Opsi 2: VPS (DigitalOcean, Contabo, dll)

```bash
# 1. SSH ke server
ssh user@ip-server

# 2. Clone / upload project
git clone <repo-url>
cd groq-api

# 3. Install dependencies
pnpm install

# 4. Jalankan dengan pm2 (process manager)
pnpm add -g pm2
pm2 start bot.js --name "telegram-bot"
pm2 save
pm2 startup  # agar auto-start saat server reboot
```

### Opsi 3: Render.com (Gratis)

1. Buat akun di [render.com](https://render.com)
2. New → Background Worker
3. Connect GitHub repo
4. Set Build Command: `pnpm install`
5. Set Start Command: `node bot.js`
6. Tambahkan environment variables di dashboard
