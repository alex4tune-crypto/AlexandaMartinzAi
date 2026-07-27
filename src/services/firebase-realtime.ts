// Firebase Realtime Database Service for Live Updates
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, push, remove, DataSnapshot } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

let app: any;
let database: any;
let auth: any;

const initFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    signInAnonymously(auth);
  }
  return { database, auth };
};

export const realtimeService = {
  // Subscribe to live product updates
  subscribeToProducts(callback: (products: any[]) => void) {
    const { database: db } = initFirebase();
    const productsRef = ref(db, 'products');
    return onValue(productsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val() || {};
      callback(Object.values(data));
    });
  },

  // Subscribe to order updates
  subscribeToOrders(userId: string, callback: (orders: any[]) => void) {
    const { database: db } = initFirebase();
    const ordersRef = ref(db, `orders/${userId}`);
    return onValue(ordersRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val() || {};
      callback(Object.values(data));
    });
  },

  // Subscribe to live metrics
  subscribeToMetrics(projectId: string, serviceId: string, callback: (metrics: any) => void) {
    const { database: db } = initFirebase();
    const metricsRef = ref(db, `metrics/${projectId}/${serviceId}`);
    return onValue(metricsRef, (snapshot: DataSnapshot) => {
      callback(snapshot.val());
    });
  },

  // Subscribe to deployment status
  subscribeToDeployment(deploymentId: string, callback: (status: any) => void) {
    const { database: db } = initFirebase();
    const deployRef = ref(db, `deployments/${deploymentId}`);
    return onValue(deployRef, (snapshot: DataSnapshot) => {
      callback(snapshot.val());
    });
  },

  // Update product
  async updateProduct(productId: string, data: any) {
    const { database: db } = initFirebase();
    await update(ref(db, `products/${productId}`), data);
  },

  // Create order
  async createOrder(userId: string, orderData: any) {
    const { database: db } = initFirebase();
    const newOrderRef = push(ref(db, `orders/${userId}`));
    await set(newOrderRef, {
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    });
    return newOrderRef.key;
  },

  // Remove listener
  unsubscribe(unsubscriber: any) {
    if (unsubscriber) unsubscriber();
  },
};
