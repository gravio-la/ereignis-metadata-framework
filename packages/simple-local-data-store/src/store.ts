import { create } from 'zustand';
import type { StoreData } from './types';

/**
 * Zustand store to manage the in-memory data
 */
export const useDataStore = create<StoreData>((set, get) => ({
  documents: {},
}));

/**
 * Adds or updates a document in the store
 */
export const upsertDocument = (typeName: string, entityIRI: string, document: any): any => {
  useDataStore.setState((state) => {
    const existingTypeMap = state.documents[typeName] || {};
    
    return {
      documents: {
        ...state.documents,
        [typeName]: {
          ...existingTypeMap,
          [entityIRI]: document
        }
      }
    };
  });
  
  return { ...document, '@id': entityIRI };
};

/**
 * Removes a document from the store
 */
export const removeDocument = (typeName: string, entityIRI: string): boolean => {
  let removed = false;
  
  useDataStore.setState((state) => {
    const typeMap = state.documents[typeName];
    if (!typeMap || !typeMap[entityIRI]) {
      return state;
    }
    
    const { [entityIRI]: _, ...restDocs } = typeMap;
    removed = true;
    
    return {
      documents: {
        ...state.documents,
        [typeName]: restDocs
      }
    };
  });
  
  return removed;
};

/**
 * Checks if a document exists in the store
 */
export const existsDocument = (typeName: string, entityIRI: string): boolean => {
  const state = useDataStore.getState();
  const typeMap = state.documents[typeName];
  
  return Boolean(typeMap && typeMap[entityIRI]);
};

/**
 * Gets a document from the store
 */
export const getDocument = (typeName: string, entityIRI: string): any => {
  const state = useDataStore.getState();
  const typeMap = state.documents[typeName];
  
  if (!typeMap || !typeMap[entityIRI]) {
    return null;
  }
  
  return typeMap[entityIRI];
};

/**
 * Lists all documents of a given type
 */
export const listDocuments = (typeName: string, limit?: number): any[] => {
  const state = useDataStore.getState();
  const typeMap = state.documents[typeName];
  
  if (!typeMap) {
    return [];
  }
  
  const docs = Object.values(typeMap);
  if (limit && limit > 0) {
    return docs.slice(0, limit);
  }
  
  return docs;
};

/**
 * Finds documents by search string (simple string matching in name or label properties)
 */
export const findDocuments = (typeName: string, searchString?: string, limit?: number): any[] => {
  const state = useDataStore.getState();
  const typeMap = state.documents[typeName];
  
  if (!typeMap) {
    return [];
  }
  
  let docs = Object.values(typeMap);
  
  if (searchString) {
    const searchLower = searchString.toLowerCase();
    docs = docs.filter((doc) => {
      // Search in common label-like properties
      return (
        String(doc.name || '').toLowerCase().includes(searchLower) ||
        String(doc.label || '').toLowerCase().includes(searchLower) ||
        String(doc.title || '').toLowerCase().includes(searchLower) ||
        String(doc['@id'] || '').toLowerCase().includes(searchLower)
      );
    });
  }
  
  if (limit && limit > 0) {
    return docs.slice(0, limit);
  }
  
  return docs;
};

/**
 * Clears all data from the store
 */
export const clearStore = (): void => {
  useDataStore.setState({ documents: {} });
}; 