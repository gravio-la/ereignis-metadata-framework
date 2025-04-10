export { initLocalStore, clearLocalStore } from './initLocalStore';

export type { SimpleLocalDataStoreConfig } from './types';

export { 
  useDataStore,
  upsertDocument, 
  removeDocument, 
  existsDocument, 
  getDocument, 
  listDocuments, 
  findDocuments,
  clearStore
} from './store';
