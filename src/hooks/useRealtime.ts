import { useEffect, useState, useCallback } from 'react';
import { realtimeService } from '../services/firebase-realtime';

export const useRealtimeProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = realtimeService.subscribeToProducts((data) => {
        setProducts(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setLoading(false);
    }
  }, []);

  return { products, loading, error };
};

export const useRealtimeOrders = (userId: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    try {
      const unsubscribe = realtimeService.subscribeToOrders(userId, (data) => {
        setOrders(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      setLoading(false);
    }
  }, [userId]);

  return { orders, loading, error };
};

export const useRealtimeMetrics = (projectId: string, serviceId: string) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !serviceId) return;
    try {
      const unsubscribe = realtimeService.subscribeToMetrics(projectId, serviceId, (data) => {
        setMetrics(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to metrics:', err);
    }
  }, [projectId, serviceId]);

  return { metrics, loading };
};

export const useRealtimeDeployment = (deploymentId: string) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deploymentId) return;
    try {
      const unsubscribe = realtimeService.subscribeToDeployment(deploymentId, (data) => {
        setStatus(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to deployment:', err);
    }
  }, [deploymentId]);

  return { status, loading };
};
