import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = io(SOCKET_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  subscribeToProducts(callback: (products: any[]) => void) {
    if (!this.socket) return;
    this.socket.on('products-update', callback);
    return () => this.socket?.off('products-update', callback);
  }

  subscribeToOrders(callback: (order: any) => void) {
    if (!this.socket) return;
    this.socket.on('new-order', callback);
    return () => this.socket?.off('new-order', callback);
  }

  subscribeToDecisions(callback: (decision: any) => void) {
    if (!this.socket) return;
    this.socket.on('ai-ceo-decision', callback);
    return () => this.socket?.off('ai-ceo-decision', callback);
  }

  // Generic emitter if needed
  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export const socketService = new SocketService();
