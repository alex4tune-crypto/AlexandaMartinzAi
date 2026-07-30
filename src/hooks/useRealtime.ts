import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

export const useRealtimeProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    fetch('/api/marketplace/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
      });

    // Subscribe to updates
    const unsubscribe = socketService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { products, loading, error };
};

export const useRealtimeOrders = (userId: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch (if we have an endpoint for user orders)
    // For now we'll just use the socket for live updates
    setLoading(false);

    const unsubscribe = socketService.subscribeToOrders((newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  return { orders, loading, error };
};

export const useRealtimeDecisions = () => {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetch('/api/analytics/events?type=ai-ceo-decision')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDecisions(data.events);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });

    const unsubscribe = socketService.subscribeToDecisions((newDecision) => {
      setDecisions(prev => [newDecision, ...prev]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { decisions, loading };
};

// Placeholder hooks for metrics and deployment (could be implemented similarly)
export const useRealtimeMetrics = (projectId: string, serviceId: string) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  return { metrics, loading };
};

export const useRealtimeDeployment = (deploymentId: string) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  return { status, loading };
};
