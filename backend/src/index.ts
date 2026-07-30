import http from 'http';
import app from './app';
import { initializeSocket } from './services/socket.service';
import { startAICeoLoop } from './services/ceo-loop.service';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`\n🚀 Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start AI CEO Loop
  startAICeoLoop();
});
