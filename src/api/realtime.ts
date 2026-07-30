// WebSocket Real-time Updates Service
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import si from 'systeminformation';

export interface RealtimeServer {
  io: SocketIOServer<any, any, any, any>;
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
      const metricsInterval = setInterval(async () => {
        try {
          const [cpu, mem, network] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.networkStats(),
          ]);

          const metrics = {
            cpuUsage: cpu.currentLoad,
            memoryUsage: (mem.active / mem.total) * 100,
            requestsPerSecond: network[0]?.rx_sec || 0, // Using rx_sec as a proxy for RPS
            errorRate: 0, // Real error rate would need middleware tracking
            latency: 20, // Real latency would need ping/probe logic
            timestamp: new Date().toISOString(),
          };
          socket.emit('metrics-update', { projectId, serviceId, metrics });
        } catch (error) {
          console.error('Error fetching real system metrics:', error);
        }
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
