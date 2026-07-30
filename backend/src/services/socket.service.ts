import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

let io: Server;

export function initializeSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function broadcast(event: string, data: any) {
  if (io) {
    io.emit(event, data);
  }
}

export function broadcastToRoom(room: string, event: string, data: any) {
  if (io) {
    io.to(room).emit(event, data);
  }
}
