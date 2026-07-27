import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  deliverableName: string;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  paymentMethodUsed?: string;
}

export interface SubscriptionItem {
  id: string;
  userId: string;
  userEmail: string;
  planName: string;
  price: number;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'past_due' | 'cancelled';
  currentPeriodEnd: string;
  createdAt: string;
  features: string[];
}

export interface CustomerOrderItem {
  id: string;
  userId: string;
  userEmail: string;
  productTitle: string;
  firmName: string;
  amount: number;
  status: 'COMPLETED' | 'IN_PRODUCTION' | 'PENDING';
  deliverableType: string;
  downloadUrl?: string;
  createdAt: string;
  trackingNumber: string;
}

export interface QuoteRequestItem {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  selectedCategory: string;
  projectRequirements: string;
  budgetTier: string;
  assignedNode: string;
  status: 'PENDING' | 'APPROVED' | 'IN_PRODUCTION' | 'DECLINED';
  createdAt: string;
  trackingNumber: string;
}

// Seed initial billing data if collection is empty
export const seedInitialBillingData = async (userId: string, userEmail: string, userName: string) => {
  if (!db) return;

  try {
    // 1. Seed Invoices if none
    const invQuery = query(collection(db, 'invoices'), where('userId', '==', userId));
    const invSnap = await getDocs(invQuery);
    if (invSnap.empty) {
      const sampleInvoices: Omit<InvoiceItem, 'id'>[] = [
        {
          invoiceNumber: 'INV-2026-001',
          userId,
          userEmail,
          userName,
          amount: 499,
          currency: 'USD',
          status: 'paid',
          description: 'Aether React SaaS Enterprise Starter Code & AST Specs',
          deliverableName: 'Full-Stack React SaaS Accelerator',
          dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          paidAt: new Date(Date.now() - 86400000 * 9).toISOString(),
          paymentMethodUsed: 'Corporate Visa (**** 4892)'
        },
        {
          invoiceNumber: 'INV-2026-002',
          userId,
          userEmail,
          userName,
          amount: 1250,
          currency: 'USD',
          status: 'pending',
          description: 'Holas Cloud Shield Security & Infrastructure Audit Retainer',
          deliverableName: 'CyberShield Cloud Audit Report',
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ];

      for (const inv of sampleInvoices) {
        const ref = doc(collection(db, 'invoices'));
        await setDoc(ref, { ...inv, id: ref.id });
      }
    }

    // 2. Seed Subscriptions if none
    const subQuery = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    const subSnap = await getDocs(subQuery);
    if (subSnap.empty) {
      const subRef = doc(collection(db, 'subscriptions'));
      const sampleSub: SubscriptionItem = {
        id: subRef.id,
        userId,
        userEmail,
        planName: 'Pro Foundry Plan',
        price: 299,
        interval: 'monthly',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 86400000 * 25).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        features: [
          'Full Access to 7 Corporate Firm Nodes',
          'Unlimited AI CEO Strategic Decision Cycles',
          'Priority Code Deliverable Synthesis',
          'Holas Security Cloud Shield Scanning'
        ]
      };
      await setDoc(subRef, sampleSub);
    }

    // 3. Seed Orders if none
    const ordQuery = query(collection(db, 'orders'), where('userId', '==', userId));
    const ordSnap = await getDocs(ordQuery);
    if (ordSnap.empty) {
      const sampleOrders: Omit<CustomerOrderItem, 'id'>[] = [
        {
          userId,
          userEmail,
          productTitle: 'Autonomous Multi-Agent Microservices Engine',
          firmName: 'Aether Web & App Development Lab',
          amount: 499,
          status: 'COMPLETED',
          deliverableType: 'Source Code & Specs',
          downloadUrl: 'https://ais-dev-wxjhxayumeozk6rtjyroce-448239526824.europe-west2.run.app/assets/source.zip',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          trackingNumber: 'TRK-98420'
        }
      ];

      for (const ord of sampleOrders) {
        const ref = doc(collection(db, 'orders'));
        await setDoc(ref, { ...ord, id: ref.id });
      }
    }
  } catch (err) {
    console.warn('Billing seed skipped:', err);
  }
};

// Listen to User Invoices in Real-Time
export const subscribeUserInvoices = (
  userId: string, 
  onUpdate: (invoices: InvoiceItem[]) => void,
  isAdmin: boolean = false
) => {
  if (!db) return () => {};
  const invCollection = collection(db, 'invoices');
  const q = isAdmin ? query(invCollection) : query(invCollection, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const list: InvoiceItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as InvoiceItem);
    });
    // Sort by createdAt desc
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(list);
  }, (err) => {
    console.warn('Invoices subscription error:', err);
  });
};

// Pay Invoice in Real Time
export const payInvoiceRealtime = async (invoiceId: string, paymentMethod: string = 'Enterprise Visa (*4892)') => {
  if (!db) throw new Error('Firestore not initialized');
  const ref = doc(db, 'invoices', invoiceId);
  await updateDoc(ref, {
    status: 'paid',
    paidAt: new Date().toISOString(),
    paymentMethodUsed: paymentMethod
  });
};

// Admin: Create Invoice
export const createAdminInvoice = async (invoiceData: Omit<InvoiceItem, 'id' | 'createdAt'>) => {
  if (!db) throw new Error('Firestore not initialized');
  const ref = doc(collection(db, 'invoices'));
  const newInvoice: InvoiceItem = {
    ...invoiceData,
    id: ref.id,
    createdAt: new Date().toISOString()
  };
  await setDoc(ref, newInvoice);
  return newInvoice;
};

// Admin: Update Invoice Status
export const updateInvoiceStatusAdmin = async (invoiceId: string, status: 'pending' | 'paid' | 'overdue' | 'cancelled') => {
  if (!db) throw new Error('Firestore not initialized');
  const ref = doc(db, 'invoices', invoiceId);
  const updates: any = { status };
  if (status === 'paid') {
    updates.paidAt = new Date().toISOString();
  }
  await updateDoc(ref, updates);
};

// Listen to Subscriptions in Real-Time
export const subscribeUserSubscriptions = (
  userId: string, 
  onUpdate: (subscriptions: SubscriptionItem[]) => void,
  isAdmin: boolean = false
) => {
  if (!db) return () => {};
  const subCollection = collection(db, 'subscriptions');
  const q = isAdmin ? query(subCollection) : query(subCollection, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const list: SubscriptionItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as SubscriptionItem);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('Subscription error:', err);
  });
};

// Update or Create Subscription Plan
export const updateSubscriptionPlan = async (
  userId: string, 
  userEmail: string, 
  planName: string, 
  price: number, 
  interval: 'monthly' | 'yearly' = 'monthly'
) => {
  if (!db) throw new Error('Firestore not initialized');
  const subCollection = collection(db, 'subscriptions');
  const q = query(subCollection, where('userId', '==', userId));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const existingDoc = snap.docs[0];
    await updateDoc(doc(db, 'subscriptions', existingDoc.id), {
      planName,
      price,
      interval,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + (interval === 'monthly' ? 30 : 365) * 86400000).toISOString()
    });
  } else {
    const ref = doc(subCollection);
    const newSub: SubscriptionItem = {
      id: ref.id,
      userId,
      userEmail,
      planName,
      price,
      interval,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      features: ['Full Corporate Network Access', 'AI CEO Execution Engine', 'Holas Security Shield']
    };
    await setDoc(ref, newSub);
  }
};

// Cancel Subscription
export const cancelUserSubscription = async (subId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  await updateDoc(doc(db, 'subscriptions', subId), {
    status: 'cancelled'
  });
};

// Listen to User Orders
export const subscribeUserOrders = (
  userId: string, 
  onUpdate: (orders: CustomerOrderItem[]) => void,
  isAdmin: boolean = false
) => {
  if (!db) return () => {};
  const ordCollection = collection(db, 'orders');
  const q = isAdmin ? query(ordCollection) : query(ordCollection, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const list: CustomerOrderItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CustomerOrderItem);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(list);
  }, (err) => {
    console.warn('Orders subscription error:', err);
  });
};

// Create Product Purchase Order
export const createCustomerOrder = async (
  userId: string, 
  userEmail: string, 
  productTitle: string, 
  firmName: string, 
  amount: number, 
  deliverableType: string
) => {
  if (!db) throw new Error('Firestore not initialized');
  const ref = doc(collection(db, 'orders'));
  const newOrder: CustomerOrderItem = {
    id: ref.id,
    userId,
    userEmail,
    productTitle,
    firmName,
    amount,
    status: 'COMPLETED',
    deliverableType,
    downloadUrl: '#download-deliverable',
    createdAt: new Date().toISOString(),
    trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}`
  };
  await setDoc(ref, newOrder);

  // Also auto-generate paid invoice for transparency
  const invRef = doc(collection(db, 'invoices'));
  const inv: InvoiceItem = {
    id: invRef.id,
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    userId,
    userEmail,
    userName: userEmail.split('@')[0],
    amount,
    currency: 'USD',
    status: 'paid',
    description: `Marketplace Purchase: ${productTitle}`,
    deliverableName: productTitle,
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
    paymentMethodUsed: 'Account Balance / Verified Card'
  };
  await setDoc(invRef, inv);

  return newOrder;
};
