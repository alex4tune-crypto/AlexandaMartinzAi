import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  role: 'customer' | 'admin';
  plan: 'Free Tier' | 'Pro Foundry' | 'Enterprise Network';
  accountBalance: number;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  avatarUrl?: string;
}

// Create User Profile Document in Firestore
export const syncUserProfile = async (user: FirebaseUser, extraData?: { displayName?: string; companyName?: string; role?: 'customer' | 'admin' }) => {
  if (!db) return null;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // Default admin for founder email or role
    const isDefaultAdmin = user.email === 'alexandamartinz4@gmail.com' || extraData?.role === 'admin';
    const profileData: UserProfileData = {
      uid: user.uid,
      email: user.email || '',
      displayName: extraData?.displayName || user.displayName || user.email?.split('@')[0] || 'Member',
      companyName: extraData?.companyName || 'Alexanda Martinz Enterprise Network',
      role: isDefaultAdmin ? 'admin' : (extraData?.role || 'customer'),
      plan: isDefaultAdmin ? 'Enterprise Network' : 'Pro Foundry',
      accountBalance: isDefaultAdmin ? 250000 : 5000,
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    await setDoc(userRef, profileData);
    return profileData;
  } else {
    // Update lastLogin and emailVerified
    const existing = snap.data() as UserProfileData;
    const updated = {
      ...existing,
      emailVerified: user.emailVerified,
      lastLogin: new Date().toISOString()
    };
    await updateDoc(userRef, {
      emailVerified: user.emailVerified,
      lastLogin: new Date().toISOString()
    });
    return updated;
  }
};

// Sign Up
export const registerWithEmail = async (
  email: string, 
  pass: string, 
  fullName: string, 
  companyName: string, 
  role: 'customer' | 'admin' = 'customer'
) => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(userCred.user, { displayName: fullName });
  
  // Try sending email verification
  try {
    await sendEmailVerification(userCred.user);
  } catch (e) {
    console.warn('Could not send verification email:', e);
  }

  const profile = await syncUserProfile(userCred.user, { displayName: fullName, companyName, role });
  return { user: userCred.user, profile };
};

// Sign In
export const loginWithEmail = async (email: string, pass: string) => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  const profile = await syncUserProfile(userCred.user);
  return { user: userCred.user, profile };
};

// Sign Out
export const logoutUser = async () => {
  if (!auth) return;
  await firebaseSignOut(auth);
};

// Password Reset
export const triggerPasswordReset = async (email: string) => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  await sendPasswordResetEmail(auth, email);
};

// Resend Verification
export const resendVerificationEmail = async (user: FirebaseUser) => {
  await sendEmailVerification(user);
};

// Update User Profile
export const updateUserProfileData = async (uid: string, updates: Partial<UserProfileData>) => {
  if (!db) return;
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);
};

// Real-time listener for user profile
export const subscribeToUserProfile = (
  uid: string, 
  onSuccess: (profile: UserProfileData) => void,
  onError?: (err: Error) => void
) => {
  if (!db) return () => {};
  const userRef = doc(db, 'users', uid);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      onSuccess(docSnap.data() as UserProfileData);
    }
  }, onError);
};
