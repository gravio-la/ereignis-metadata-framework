import type { 
  AbstractDatastore, 
  CountAndIterable, 
  InitDatastoreFunction, 
  QueryType 
} from "@graviola/edb-global-types";
import type { Entity } from "@graviola/edb-core-types";
import type { SimpleLocalDataStoreConfig } from "./types";
import { 
  useDataStore,
  upsertDocument, 
  removeDocument, 
  existsDocument, 
  getDocument, 
  listDocuments, 
  findDocuments as findStoreDocuments,
  clearStore 
} from "./store";

/**
 * Initialize a simple in-memory data store using Zustand
 */
export const initLocalStore: InitDatastoreFunction<SimpleLocalDataStoreConfig> = (
  config
) => {
  const { typeNameToTypeIRI, typeIRItoTypeName, defaultLimit = 100 } = config;

  /**
   * Creates an async iterable for document collections
   */
  const createAsyncIterable = (docs: any[]): CountAndIterable<any> => {
    let currentIndex = 0;
    const asyncIterator = {
      next: () => {
        if (currentIndex >= docs.length) {
          return Promise.resolve({ done: true, value: null });
        }
        const doc = docs[currentIndex];
        currentIndex++;
        return Promise.resolve({ done: false, value: doc });
      }
    };

    return {
      amount: docs.length,
      iterable: {
        [Symbol.asyncIterator]: () => asyncIterator
      }
    };
  };

  /**
   * Implementation of the AbstractDatastore interface
   */
  const datastore: AbstractDatastore = {
    typeNameToTypeIRI,
    typeIRItoTypeName,

    // Document operations
    loadDocument: async (typeName, entityIRI) => {
      const doc = getDocument(typeName, entityIRI);
      if (!doc) {
        throw new Error(`Document not found: ${typeName} - ${entityIRI}`);
      }
      return doc;
    },

    existsDocument: async (typeName, entityIRI) => {
      return existsDocument(typeName, entityIRI);
    },

    upsertDocument: async (typeName, entityIRI, document) => {
      return upsertDocument(typeName, entityIRI, {
        ...document,
        '@type': typeNameToTypeIRI(typeName),
        '@id': entityIRI
      });
    },

    removeDocument: async (typeName, entityIRI) => {
      return removeDocument(typeName, entityIRI);
    },

    // List/find operations
    listDocuments: async (typeName, limit = defaultLimit, cb) => {
      const docs = listDocuments(typeName, limit);
      if (cb) {
        return Promise.all(docs.map(cb));
      }
      return docs;
    },

    findDocuments: async (typeName, query, limit = defaultLimit, cb) => {
      const docs = findStoreDocuments(typeName, query.search, limit);
      
      // Apply sorting if specified
      if (query.sorting && query.sorting.length > 0) {
        docs.sort((a, b) => {
          for (const sort of query.sorting!) {
            const aValue = a[sort.id];
            const bValue = b[sort.id];
            
            if (aValue === bValue) continue;
            
            // Handle undefined/null values
            if (aValue === undefined || aValue === null) return sort.desc ? -1 : 1;
            if (bValue === undefined || bValue === null) return sort.desc ? 1 : -1;
            
            // Compare values
            const comparison = 
              typeof aValue === 'string' 
                ? aValue.localeCompare(bValue) 
                : aValue - bValue;
                
            return sort.desc ? -comparison : comparison;
          }
          return 0;
        });
      }
      
      // Apply pagination if specified
      let paginatedDocs = docs;
      if (query.pagination) {
        const { pageIndex, pageSize } = query.pagination;
        const start = pageIndex * pageSize;
        paginatedDocs = docs.slice(start, start + pageSize);
      } else if (limit) {
        paginatedDocs = docs.slice(0, limit);
      }
      
      if (cb) {
        return Promise.all(paginatedDocs.map(cb));
      }
      return paginatedDocs;
    },
    
    // Entity search operations
    findDocumentsByLabel: async (typeName, label, limit = defaultLimit) => {
      return findStoreDocuments(typeName, label, limit);
    },
    
    findEntityByTypeName: async (typeName, searchString, limit = defaultLimit): Promise<Entity[]> => {
      const docs = findStoreDocuments(typeName, searchString, limit);
      return docs.map(doc => ({
        entityIRI: doc['@id'],
        typeIRI: doc['@type'] || typeNameToTypeIRI(typeName),
        value: doc['@id'], // deprecated but required by the Entity type
        label: doc.label || doc.name || doc.title || doc['@id']
      }));
    },
    
    // Counting operations
    countDocuments: async (typeName, query) => {
      return findStoreDocuments(
        typeName, 
        query.search, 
        undefined // No limit for counting
      ).length;
    },
    
    // Flat result set
    findDocumentsAsFlatResultSet: async (typeName, query, limit = defaultLimit) => {
      const docs = await datastore.findDocuments(typeName, query, limit);
      return {
        results: {
          bindings: docs.map(doc => {
            const result: Record<string, { value: any }> = {};
            
            // Convert document properties to bindings format
            for (const [key, value] of Object.entries(doc)) {
              if (key.startsWith('@')) continue; // Skip JSON-LD metadata
              result[key] = { value };
            }
            
            // Add entity IRI
            result.entityIRI = { value: doc['@id'] };
            
            return result;
          })
        },
        head: {
          vars: docs.length > 0 ? 
            ['entityIRI', ...Object.keys(docs[0] || {}).filter(k => !k.startsWith('@'))] : 
            ['entityIRI']
        }
      };
    },
    
    // Import operations - basic implementations
    importDocument: async (typeName, entityIRI, importStore) => {
      const doc = await importStore.loadDocument(typeName, entityIRI);
      return await datastore.upsertDocument(typeName, entityIRI, doc);
    },
    
    importDocuments: async (typeName, importStore, limit = defaultLimit) => {
      const docs = await importStore.listDocuments(typeName, limit);
      const results: any[] = [];
      
      for (const doc of docs) {
        const entityIRI = doc['@id'];
        if (entityIRI) {
          results.push(
            await datastore.upsertDocument(typeName, entityIRI, doc)
          );
        }
      }
      
      return results;
    },
    
    // Classes - simple implementation returning just the type
    getClasses: async (entityIRI) => {
      const state = useDataStore.getState();
      for (const typeName in state.documents) {
        if (existsDocument(typeName, entityIRI)) {
          return [typeNameToTypeIRI(typeName)];
        }
      }
      return [];
    },
    
    // Iterable implementation
    iterableImplementation: {
      listDocuments: async (typeName, limit = defaultLimit) => {
        const docs = listDocuments(typeName, limit);
        return createAsyncIterable(docs);
      },
      
      findDocuments: async (typeName, query, limit = defaultLimit) => {
        const docs = findStoreDocuments(typeName, query.search, limit);
        return createAsyncIterable(docs);
      }
    }
  };

  return datastore;
};

/**
 * Utility function to clear all data from the store
 * (Not part of the AbstractDatastore interface, but useful for testing)
 */
export const clearLocalStore = (): void => {
  clearStore();
}; 