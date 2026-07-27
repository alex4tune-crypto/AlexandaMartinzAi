// WebSocket Real-time Updates Service
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export interface RealtimeServer {
  io: SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  broadcast: (event: string, data: any) => void;
  broadcastToRoom: (room: string, event: string, data: any) => void;
}

export const initializeRealtimeServer = (httpServer: HTTPServer): RealtimeServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room (e.g., project-specific updates)
    socket.on('join-project', (projectId: string) => {
      socket.join(`project-${projectId}`);
      socket.emit('joined', { message: `Joined project ${projectId}` });
    });

    // Leave room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project-${projectId}`);
    });

    // Subscribe to metrics
    socket.on('subscribe-metrics', (projectId: string, serviceId: string) => {
      const metricsInterval = setInterval(() => {
        const metrics = {
          cpuUsage: Math.random() * 80 + 10,
          memoryUsage: Math.random() * 70 + 20,
          requestsPerSecond: Math.random() * 500 + 100,
          errorRate: Math.random() * 5,
          latency: Math.random() * 200 + 50,
          timestamp: new Date().toISOString(),
        };
        socket.emit('metrics-update', { projectId, serviceId, metrics });
      }, 1000); // Update every second

      // Cleanup on disconnect
      socket.on('disconnect', () => clearInterval(metricsInterval));
    });

    // Listen for events and broadcast
    socket.on('deployment-update', (data) => {
      io.to(`project-${data.projectId}`).emit('deployment-status', data);
    });

    socket.on('service-alert', (data) => {
      io.emit('alert', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return {
    io,
    broadcast: (event: string, data: any) => io.emit(event, data),
    broadcastToRoom: (room: string, event: string, data: any) => {
      io.to(room).emit(event, data);
    },
  };
};
