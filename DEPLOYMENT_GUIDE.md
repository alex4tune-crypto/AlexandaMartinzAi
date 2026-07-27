# Deployment Guide

This guide covers deploying your full-stack React + Express application to **Heroku** and **Railway**.

## Prerequisites

- GitHub account (you have this ✓)
- Heroku account (free tier available)
- Railway account (free tier available)
- Git CLI installed

## Deploy to Heroku

### Step 1: Create Heroku App
```bash
# Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
heroku login
heroku create your-app-name
```

### Step 2: Set Environment Variables
```bash
heroku config:set VITE_GOOGLE_GENAI_API_KEY=your_key
heroku config:set FIREBASE_API_KEY=your_key
# Add other environment variables as needed
```

### Step 3: Deploy
```bash
git push heroku main
```

### Step 4: View Logs
```bash
heroku logs --tail
```

### Option: Automatic Deployment via GitHub Actions

1. **Get your Heroku API key:**
   - Go to https://dashboard.heroku.com/account/applications/authorizations/new
   - Create a new authorization token

2. **Add GitHub Secrets** (https://github.com/alex4tune-crypto/AlexandaMartinzAi/settings/secrets/actions):
   - `HEROKU_API_KEY` - Your Heroku API key
   - `HEROKU_EMAIL` - Your Heroku email
   - `HEROKU_APP_NAME` - Your Heroku app name

3. **Automatic deployment is now enabled** - Every push to main will deploy!

---

## Deploy to Railway

### Step 1: Connect Your Repository
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `alex4tune-crypto/AlexandaMartinzAi`
5. Click "Deploy"

### Step 2: Configure Environment Variables
In Railway dashboard:
1. Go to your project
2. Click the project name
3. Go to "Variables" tab
4. Add all required environment variables from `.env.example`

### Step 3: Deploy
Railway will automatically build and deploy when you push to main!

### View Logs
In the Railway dashboard, click your service and view the "Logs" tab.

---

## Build & Run Locally

```bash
# Install dependencies
npm install

# Development
npm run dev    # Starts both frontend (Vite) and backend (Express)

# Production build
npm run build

# Start production server
npm start
```

## Important Notes

- **Port**: Your app runs on port 3000 (configurable via `PORT` env var)
- **Frontend**: Built by Vite and served by Express from `/dist`
- **Backend**: Express API running on the same port
- **Environment Variables**: Add all variables from `.env.example` to your deployment platform

## Troubleshooting

**Build fails:**
- Check that all dependencies are listed in `package.json`
- Ensure `npm run build` works locally: `npm install && npm run build`

**App crashes after deploy:**
- Check logs: `heroku logs --tail` or Railway dashboard
- Verify all environment variables are set
- Make sure `npm start` runs without errors locally

**Port issues:**
- Heroku/Railway assign a dynamic port - use `process.env.PORT || 3000`

---

## What Happens on Deploy

1. **Install dependencies** - `npm install`
2. **Build** - `npm run build` (Vite builds React frontend, esbuild bundles Express server)
3. **Start** - `npm start` (Node runs the bundled server.cjs)
4. **Serve** - Express serves React frontend + API routes

