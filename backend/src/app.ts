import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import aiRoutes from './routes/ai.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import analyticsRoutes from './routes/analytics.routes';
import systemRoutes from './routes/system.routes';
import userRoutes from './routes/user.routes';
import northflankRouter from '../../src/api/northflank';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/user', userRoutes);
app.use('/api/northflank', northflankRouter);

// Frontend Serving
const setupFrontend = async () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  
  if (NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.join(process.cwd(), '../') // Point to root where vite.config.ts is
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
};

setupFrontend().catch(err => {
  console.error('Failed to setup frontend middleware:', err);
});

export default app;
