
import { User } from '../types';

// The key used to persist the *current* session (like a session token)
const USER_SESSION_KEY = 'hyron_auth_session';

// --- MOCK CLOUD DATABASE ---
// In a real production app, this data lives on a secure server (Firebase, AWS, Supabase).
// We store it in memory here to simulate a backend. It is NOT stored in the browser's localStorage.
let MOCK_CLOUD_DB = [
  {
    id: 'user_demo_123',
    name: 'Arjun Mehta',
    email: 'demo@hyron.ai',
    password: 'password', // In real app, this would be hashed
    phone: '9876543210',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=3b82f6&color=fff',
    plan: 'Free',
    freeDocsUsed: 0
  }
];

// --- Auth Functions ---

export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_SESSION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse current session.", e);
    localStorage.removeItem(USER_SESSION_KEY);
  }
  return null;
};

// Simulated Phone OTP
export const sendPhoneOTP = async (phone: string): Promise<boolean> => {
  // Simulate network request to SMS gateway
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would trigger an actual SMS.
  // For demo purposes, we show the code in an alert.
  alert(`HYRON SECURITY\n\nYour verification code is: 8859`);
  return true;
};

export const verifyPhoneOTP = async (otp: string): Promise<boolean> => {
  // Simulate verification check
  await new Promise(resolve => setTimeout(resolve, 1000));
  return otp === '8859';
};

// Email Login
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  // Simulate API call to cloud
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = MOCK_CLOUD_DB.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    plan: user.plan as any,
    freeDocsUsed: user.freeDocsUsed || 0
  };

  // Persist the SESSION, not the database
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

// Email Signup
export const signupWithEmail = async (data: { name: string; email: string; password: string; phone: string }): Promise<User> => {
  // Simulate API call to create user
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (MOCK_CLOUD_DB.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("User with this email already exists.");
  }

  const newUser = {
    id: 'user_' + crypto.randomUUID().substring(0, 8),
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3b82f6&color=fff`,
    plan: 'Free',
    freeDocsUsed: 0
  };

  // Add to in-memory cloud DB
  MOCK_CLOUD_DB.push(newUser);
  
  const sessionUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    plan: 'Free',
    freeDocsUsed: 0
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

// Google Auth
export const loginWithGoogle = async (credentials?: {name: string, email: string}): Promise<User> => {
  // Simulate OAuth handshake
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const name = credentials?.name || 'Google User';
  const email = credentials?.email || 'user@gmail.com';
  
  // Check our mock cloud DB
  const existingUser = MOCK_CLOUD_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  let user: User;

  if (existingUser) {
    // Return existing user details including their current Plan
    user = {
        id: existingUser.id,
        name: existingUser.name, 
        email: existingUser.email,
        avatar: existingUser.avatar,
        plan: existingUser.plan as any,
        freeDocsUsed: existingUser.freeDocsUsed || 0
    };
  } else {
    // Register new google user in mock cloud DB
    const newUser = {
        id: 'google_' + btoa(email).substring(0, 12),
        name: name,
        email: email,
        password: '', // No password for google auth
        phone: '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
        plan: 'Free', // Default to Free
        freeDocsUsed: 0
    };
    
    MOCK_CLOUD_DB.push(newUser);
    
    user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        plan: 'Free',
        freeDocsUsed: 0
    };
  }

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  return user;
};

export const logout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem(USER_SESSION_KEY);
};

export const upgradeUserPlan = (plan: 'Starter' | 'Pro' | 'Lifetime') => {
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, plan };
    
    // Update session
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
    
    // Update Cloud DB
    const dbUserIndex = MOCK_CLOUD_DB.findIndex(u => u.id === user.id);
    if (dbUserIndex >= 0) {
        (MOCK_CLOUD_DB[dbUserIndex] as any).plan = plan;
    }
    
    return updatedUser;
  }
  return null;
};

export const incrementFreeDocsUsage = () => {
  const user = getCurrentUser();
  if (user && user.plan === 'Free') {
    const updatedUser = { ...user, freeDocsUsed: (user.freeDocsUsed || 0) + 1 };
    
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
    
    const dbUserIndex = MOCK_CLOUD_DB.findIndex(u => u.id === user.id);
    if (dbUserIndex >= 0) {
        (MOCK_CLOUD_DB[dbUserIndex] as any).freeDocsUsed = updatedUser.freeDocsUsed;
    }
    return updatedUser;
  }
  return user;
};
