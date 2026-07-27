export interface AnalyticsEventPayload {
  type: 
    | 'impression' 
    | 'product_view' 
    | 'vendor_view' 
    | 'inquiry_created' 
    | 'quote_requested' 
    | 'order_created' 
    | 'purchase_completed' 
    | 'repeat_visit' 
    | 'subscription_renewed' 
    | 'product_published' 
    | 'product_rejected' 
    | 'ai_directive_issued' 
    | 'ai_directive_executed';
  entityId?: string;
  firmName?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export const trackEvent = async (payload: AnalyticsEventPayload) => {
  try {
    const res = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to track analytics event:', err);
    return { success: false };
  }
};

export const fetchAnalyticsEvents = async () => {
  try {
    const res = await fetch('/api/analytics/events');
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch analytics events:', err);
    return { success: false, events: [] };
  }
};

export const fetchRetentionData = async () => {
  try {
    const res = await fetch('/api/analytics/retention');
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch retention metrics:', err);
    return { success: false };
  }
};
