
export type NDAType = 'Mutual' | 'One-way';

export interface NDAFormData {
  type: NDAType;
  partyA: string;
  partyB: string;
  purpose: string;
  effectiveDate: string;
  duration: string;
  country: string;
  jurisdiction: string;
  clauses: {
    nonCompete: boolean;
    nonSolicitation: boolean;
    ipOwnership: boolean;
    dataProtection: boolean;
  };
}

export const INITIAL_FORM_DATA: NDAFormData = {
  type: 'Mutual',
  partyA: '',
  partyB: '',
  purpose: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  duration: '3',
  country: 'India',
  jurisdiction: 'New Delhi',
  clauses: {
    nonCompete: false,
    nonSolicitation: false,
    ipOwnership: true,
    dataProtection: true,
  }
};

export type UserPlan = 'Free' | 'Starter' | 'Pro' | 'Lifetime';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: UserPlan;
  freeDocsUsed: number;
}

export interface SavedDocument {
  id: string;
  userId: string;
  title: string;
  content: string;
  formData: NDAFormData;
  createdAt: string;
  isPaid?: boolean;
}