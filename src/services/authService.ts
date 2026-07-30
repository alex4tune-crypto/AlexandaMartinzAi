import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface UserProfileData {
  id: string;
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

// Sync User Profile with Backend (PostgreSQL)
export const syncUserProfile = async (user: FirebaseUser, extraData?: { displayName?: string; companyName?: string; role?: 'customer' | 'admin' }) => {
  const res = await fetch('/api/user/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: user.uid,
      email: user.email,
      displayName: extraData?.displayName || user.displayName,
      companyName: extraData?.companyName,
      role: extraData?.role,
      emailVerified: user.emailVerified
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to sync profile');
  return data.user as UserProfileData;
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
  await firebaseUpdateProfile(userCred.user, { displayName: fullName });
  
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

// Update User Profile Data in Backend
export const updateUserProfileData = async (uid: string, updates: Partial<UserProfileData>) => {
  const res = await fetch(`/api/user/${uid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data.user as UserProfileData;
};

// Fetch user profile
export const fetchUserProfile = async (uid: string) => {
  const res = await fetch(`/api/user/${uid}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
  return data.user as UserProfileData;
};

// Real-time listener placeholder (could be implemented with WebSockets if needed)
export const subscribeToUserProfile = (
  uid: string, 
  onSuccess: (profile: UserProfileData) => void,
  onError?: (err: Error) => void
) => {
  fetchUserProfile(uid).then(onSuccess).catch(onError);
  return () => {}; // Polling or WebSockets could be added here
};
