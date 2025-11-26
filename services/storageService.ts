import { SavedDocument, NDAFormData } from '../types';

const STORAGE_KEY = 'hyron_ai_documents_v1';

const getStorage = (): SavedDocument[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStorage = (docs: SavedDocument[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const saveDocument = (userId: string, formData: NDAFormData, content: string): SavedDocument => {
  const docs = getStorage();
  
  const newDoc: SavedDocument = {
    id: crypto.randomUUID(),
    userId,
    title: `${formData.type} NDA: ${formData.partyA} & ${formData.partyB}`,
    content,
    formData,
    createdAt: new Date().toISOString()
  };

  setStorage([newDoc, ...docs]);
  return newDoc;
};

export const getUserDocuments = (userId: string): SavedDocument[] => {
  const docs = getStorage();
  return docs.filter(doc => doc.userId === userId);
};

export const deleteDocument = (docId: string) => {
  const docs = getStorage();
  const filtered = docs.filter(doc => doc.id !== docId);
  setStorage(filtered);
};
