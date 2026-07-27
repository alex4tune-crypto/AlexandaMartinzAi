# ⚡ QUICK START GUIDE

## Prerequisites
- Git installed
- One deployment account (Railway, Fly.io, Render, etc.)
- Your API keys ready

---

## 🚀 FASTEST DEPLOYMENT (Railway - 2 minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/alex4tune-crypto/AlexandaMartinzAi.git
cd AlexandaMartinzAi
```

### Step 2: Create .env File
```bash
cp .env.production .env
```

### Step 3: Add Your API Keys
Edit `.env` and fill in:
- `GEMINI_API_KEY`
- `NORTHFLANK_API_KEY`
- `REACT_APP_FIREBASE_PROJECT_ID`
- Email credentials (optional)

### Step 4: Push to Railway
```bash
# Option A: CLI
npm install -g @railway/cli
railway login
railway up

# Option B: Web Dashboard
# 1. Go to railway.app
# 2. Click "New Project"
# 3. Click "Deploy from GitHub"
# 4. Select alex4tune-crypto/AlexandaMartinzAi
# 5. Set environment variables
# 6. Deploy!
```

### Step 5: Done! 🎉
Your app is live at the Railway URL provided.

---

## 🌍 OTHER PLATFORMS

### Fly.io (3 minutes)
```bash
npm install -g flyctl
flyctl auth login
flyctl deploy
```

### Render (3 minutes - Web Dashboard)
1. Go to render.com
2. Click "Create New" → "Web Service"
3. Connect GitHub → Select repo
4. Set environment variables
5. Deploy!

### DigitalOcean (5 minutes - Web Dashboard)
1. Go to cloud.digitalocean.com
2. Click "Create" → "App Platform"
3. Connect GitHub → Select repo
4. Set environment variables
5. Deploy!

---

## 🔑 Required Environment Variables

```env
# AI Services
VITE_GOOGLE_GENAI_API_KEY=sk-...

# Cloud Platform (Northflank)
NORTHFLANK_API_KEY=...
NORTHFLANK_ORGANIZATION_ID=...

# Firebase
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_DATABASE_URL=...

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=app_password

# Server
NODE_ENV=production
PORT=3000
```

---

## ✅ Verify Deployment

```bash
# Visit health endpoint
curl https://your-app-url.app/api/health

# Should return:
{
  "status": "ok",
  "environment": "production",
  "timestamp": "..."
}
```

---

## 🎯 What's Deployed

✅ Full-stack app (frontend + backend)
✅ WebSocket real-time updates
✅ Northflank cloud integration
✅ Email notifications
✅ Marketplace with analytics
✅ AI CEO & agent endpoints
✅ Security & monitoring

---

## 📱 Access Your App

- **Main App:** https://your-app-url.app
- **API:** https://your-app-url.app/api
- **Health Check:** https://your-app-url.app/api/health
- **WebSocket:** wss://your-app-url.app (auto-connected)

---

## 🆘 Troubleshooting

**App won't start?**
→ Check logs: `railway logs` or platform dashboard

**Environment variables not working?**
→ Make sure they're set in the platform dashboard, not just .env

**Database connection error?**
→ Add PostgreSQL service in platform dashboard

**WebSocket connection failing?**
→ Verify platform supports WebSockets (Railway/Fly.io/Render do)

---

## 📚 Full Documentation

See `DEPLOYMENT_RANKING.md` for detailed platform comparison.
See `BUILD_AND_DEPLOY.md` for local development.

---

**Need help? Check the platform docs or run:**
```bash
railway logs -f  # Real-time logs
```
