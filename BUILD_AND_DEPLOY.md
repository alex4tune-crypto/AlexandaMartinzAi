# Build & Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Add your API keys
# GEMINI_API_KEY
# NORTHFLANK_API_KEY
# Firebase credentials
# Email service credentials

# Start development server
npm run dev
```

App will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

---

## Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t alexanda-martinz:latest .

# Run container
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e NORTHFLANK_API_KEY=your_key \
  alexanda-martinz:latest
```

### Docker Compose (Recommended)

```bash
# Create .env file with credentials
cp .env.production .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

---

## Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key
heroku config:set NORTHFLANK_API_KEY=your_key
heroku config:set REACT_APP_FIREBASE_PROJECT_ID=your_id
# ... other variables

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up

# Or use Web UI: https://railway.app
```

---

## Deploy to Northflank

```bash
# Using Northflank CLI
nfctl project create
nfctl service create --name alexanda-martinz
nfctl service deploy
```

Or use Northflank Web Dashboard:
1. Connect GitHub repository
2. Create new project
3. Link to main branch
4. Configure environment variables
5. Deploy

---

## Production Environment Variables

```env
# AI Services
VITE_GOOGLE_GENAI_API_KEY=sk-...

# Cloud Platform
NORTHFLANK_API_KEY=...
NORTHFLANK_ORGANIZATION_ID=...

# Firebase
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_DATABASE_URL=...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=app_password

# Server
NODE_ENV=production
PORT=3000
```

---

## Health Checks & Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "2026-07-27T15:00:00Z"
}
```

### Real-time Monitoring
- **Logs**: `docker-compose logs -f app`
- **Metrics**: `/api/northflank/projects/:id/services/:svc/metrics`
- **WebSocket**: `ws://localhost:3000`

---

## Scaling

### Docker Compose with Multiple Replicas

```bash
# Scale app to 3 replicas
docker-compose up -d --scale app=3
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alexanda-martinz
spec:
  replicas: 3
  selector:
    matchLabels:
      app: alexanda-martinz
  template:
    metadata:
      labels:
        app: alexanda-martinz
    spec:
      containers:
      - name: app
        image: alexanda-martinz:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: gemini-api-key
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Docker Build Issues
```bash
# Clear Docker cache and rebuild
docker-compose down -v
docker-compose build --no-cache
```

### Memory Issues
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## Performance Optimization

- ✅ Multi-stage Docker build for minimal image size
- ✅ Production build with Vite optimization
- ✅ Redis caching layer (optional)
- ✅ Health checks for auto-restart
- ✅ Non-root user for security
- ✅ WebSocket for real-time updates
- ✅ CDN-ready static assets

