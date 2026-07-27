import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  UserProfileData, 
  syncUserProfile, 
  subscribeToUserProfile, 
  registerWithEmail, 
  loginWithEmail, 
  logoutUser, 
  triggerPasswordReset,
  updateUserProfileData
} from '../services/authService';
import { 
  InvoiceItem, 
  SubscriptionItem, 
  CustomerOrderItem, 
  subscribeUserInvoices, 
  subscribeUserSubscriptions, 
  subscribeUserOrders,
  seedInitialBillingData,
  payInvoiceRealtime,
  updateSubscriptionPlan
} from '../services/billingService';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfileData | null;
  loadingAuth: boolean;
  isAdmin: boolean;
  
  // Real-time Billing State
  invoices: InvoiceItem[];
  subscriptions: SubscriptionItem[];
  orders: CustomerOrderItem[];
  
  // Auth Actions
  signUp: (email: string, pass: string, name: string, company: string, role?: 'customer' | 'admin') => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileInfo: (updates: Partial<UserProfileData>) => Promise<void>;

  // Billing Actions
  payInvoice: (invoiceId: string, paymentMethod?: string) => Promise<void>;
  changeSubscriptionPlan: (planName: string, price: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // Billing Real-Time State
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrderItem[]>([]);

  // Auth Listener
  useEffect(() => {
    if (!auth) {
      setLoadingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        // Sync user profile
        try {
          const profile = await syncUserProfile(firebaseUser);
          if (profile) {
            setUserProfile(profile);
            // Seed sample billing data if first time
            await seedInitialBillingData(profile.uid, profile.email, profile.displayName);
          }
        } catch (err) {
          console.warn('Profile sync error:', err);
        }
      } else {
        setUserProfile(null);
        setInvoices([]);
        setSubscriptions([]);
        setOrders([]);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Profile Real-time Sync
  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToUserProfile(currentUser.uid, (profile) => {
      setUserProfile(profile);
    });
    return () => unsub();
  }, [currentUser]);

  // Billing Real-time Sync (Invoices, Subscriptions, Orders)
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    const isAdminRole = userProfile.role === 'admin';

    // Invoices Real-time
    const unsubInv = subscribeUserInvoices(userProfile.uid, (data) => {
      setInvoices(data);
    }, isAdminRole);

    // Subscriptions Real-time
    const unsubSub = subscribeUserSubscriptions(userProfile.uid, (data) => {
      setSubscriptions(data);
    }, isAdminRole);

    // Orders Real-time
    const unsubOrd = subscribeUserOrders(userProfile.uid, (data) => {
      setOrders(data);
    }, isAdminRole);

    return () => {
      unsubInv();
      unsubSub();
      unsubOrd();
    };
  }, [currentUser, userProfile]);

  // Actions
  const signUp = async (email: string, pass: string, name: string, company: string, role: 'customer' | 'admin' = 'customer') => {
    return await registerWithEmail(email, pass, name, company, role);
  };

  const signIn = async (email: string, pass: string) => {
    return await loginWithEmail(email, pass);
  };

  const signOut = async () => {
    await logoutUser();
  };

  const resetPassword = async (email: string) => {
    await triggerPasswordReset(email);
  };

  const updateProfileInfo = async (updates: Partial<UserProfileData>) => {
    if (!userProfile) return;
    await updateUserProfileData(userProfile.uid, updates);
  };

  const payInvoice = async (invoiceId: string, paymentMethod?: string) => {
    await payInvoiceRealtime(invoiceId, paymentMethod);
  };

  const changeSubscriptionPlan = async (planName: string, price: number) => {
    if (!userProfile) return;
    await updateSubscriptionPlan(userProfile.uid, userProfile.email, planName, price);
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loadingAuth,
      isAdmin,
      invoices,
      subscriptions,
      orders,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfileInfo,
      payInvoice,
      changeSubscriptionPlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
