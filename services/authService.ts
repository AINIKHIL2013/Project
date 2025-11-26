
import { User, UserPlan } from '../types';

// The key used to persist the *current* session (like a session token)
const USER_SESSION_KEY = 'hyron_auth_session';

// --- MOCK CLOUD DATABASE ---
// In a real production app, this data lives on a secure server.
let MOCK_CLOUD_DB: any[] = [
  {
    id: 'user_demo_123',
    name: 'Arjun Mehta',
    email: 'demo@hyron.ai',
    password: 'password', 
    phone: '9876543210',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=3b82f6&color=fff',
    plan: 'Sample',
    docsCreatedThisMonth: 0,
    lastFreeGenerationDate: null
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
  await new Promise(resolve => setTimeout(resolve, 1500));
  alert(`HYRON SECURITY\n\nYour verification code is: 8859`);
  return true;
};

export const verifyPhoneOTP = async (otp: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return otp === '8859';
};

// Email Login
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
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
    plan: user.plan as UserPlan,
    freeDocsUsed: 0,
    docsCreatedThisMonth: user.docsCreatedThisMonth || 0,
    lastFreeGenerationDate: user.lastFreeGenerationDate
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

// Email Signup
export const signupWithEmail = async (data: { name: string; email: string; password: string; phone: string }): Promise<User> => {
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
    plan: 'Sample',
    docsCreatedThisMonth: 0,
    lastFreeGenerationDate: null
  };

  MOCK_CLOUD_DB.push(newUser);
  
  const sessionUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    plan: 'Sample',
    freeDocsUsed: 0,
    docsCreatedThisMonth: 0,
    lastFreeGenerationDate: undefined
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

// Google Auth
export const loginWithGoogle = async (credentials?: {name: string, email: string}): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const name = credentials?.name || 'Google User';
  const email = credentials?.email || 'user@gmail.com';
  
  const existingUser = MOCK_CLOUD_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  let user: User;

  if (existingUser) {
    user = {
        id: existingUser.id,
        name: existingUser.name, 
        email: existingUser.email,
        avatar: existingUser.avatar,
        plan: existingUser.plan as UserPlan,
        freeDocsUsed: 0,
        docsCreatedThisMonth: existingUser.docsCreatedThisMonth || 0,
        lastFreeGenerationDate: existingUser.lastFreeGenerationDate
    };
  } else {
    const newUser = {
        id: 'google_' + btoa(email).substring(0, 12),
        name: name,
        email: email,
        password: '', 
        phone: '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
        plan: 'Sample',
        docsCreatedThisMonth: 0,
        lastFreeGenerationDate: null
    };
    
    MOCK_CLOUD_DB.push(newUser);
    
    user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        plan: 'Sample',
        freeDocsUsed: 0,
        docsCreatedThisMonth: 0,
        lastFreeGenerationDate: undefined
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
    const updatedUser: User = { ...user, plan };
    
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
    
    const dbUserIndex = MOCK_CLOUD_DB.findIndex(u => u.id === user.id);
    if (dbUserIndex >= 0) {
        MOCK_CLOUD_DB[dbUserIndex].plan = plan;
    }
    
    return updatedUser;
  }
  return null;
};

export const checkUsageEligibility = (user: User): { allowed: boolean; reason?: string } => {
  if (user.plan === 'Lifetime') return { allowed: true };

  const LIMITS = {
    'Sample': 1, // 1 per 30 days
    'Starter': 5, // per month
    'Pro': 20, // per month
  };

  if (user.plan === 'Sample') {
    if (user.lastFreeGenerationDate) {
      const lastDate = new Date(user.lastFreeGenerationDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      // Limit to 1 per 30 days (approx 1 month)
      if (diffDays < 30) {
        return { 
          allowed: false, 
          reason: `Sample limit reached. You can generate another free NDA in ${30 - diffDays} days.` 
        };
      }
    }
    return { allowed: true };
  }

  // Paid Plans (Monthly limits)
  const limit = LIMITS[user.plan] || 0;
  if (user.docsCreatedThisMonth >= limit) {
    return { 
      allowed: false, 
      reason: `Monthly limit reached (${user.docsCreatedThisMonth}/${limit}). Upgrade for more.` 
    };
  }

  return { allowed: true };
};

export const recordGenerationUsage = () => {
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user };
    const now = new Date().toISOString();

    if (user.plan === 'Sample') {
      updatedUser.lastFreeGenerationDate = now;
    } else {
      updatedUser.docsCreatedThisMonth = (user.docsCreatedThisMonth || 0) + 1;
    }
    
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
    
    const dbUserIndex = MOCK_CLOUD_DB.findIndex(u => u.id === user.id);
    if (dbUserIndex >= 0) {
        const dbUser = MOCK_CLOUD_DB[dbUserIndex];
        if (user.plan === 'Sample') {
          dbUser.lastFreeGenerationDate = now;
        } else {
          dbUser.docsCreatedThisMonth = (dbUser.docsCreatedThisMonth || 0) + 1;
        }
    }
    return updatedUser;
  }
  return user;
};
