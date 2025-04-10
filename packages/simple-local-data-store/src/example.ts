import { initLocalStore, clearLocalStore } from './initLocalStore';
import type { JSONSchema7 } from 'json-schema';

// This is a demonstration file that shows how to use the simple-local-data-store
// It is not compiled into the final package

async function runExample() {
  console.log('🚀 Simple Local Data Store Example');
  
  // Define a simple schema
  const schema: JSONSchema7 = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      age: { type: 'number' },
      email: { type: 'string', format: 'email' }
    },
    required: ['name']
  };

  // Define type mapping functions
  const typeNameToTypeIRI = (typeName: string) => `http://example.org/ontology#${typeName}`;
  const typeIRItoTypeName = (typeIRI: string) => typeIRI.replace('http://example.org/ontology#', '');

  // Initialize the store
  const datastore = initLocalStore({
    schema,
    typeNameToTypeIRI,
    typeIRItoTypeName,
    defaultLimit: 10
  });

  console.log('📦 Store initialized');

  // Create some sample data
  const person1 = await datastore.upsertDocument(
    'Person',
    'http://example.org/people/john-doe',
    {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    }
  );

  const person2 = await datastore.upsertDocument(
    'Person',
    'http://example.org/people/jane-doe',
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 28
    }
  );

  const person3 = await datastore.upsertDocument(
    'Person',
    'http://example.org/people/bob-smith',
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      age: 42
    }
  );

  console.log('👥 Created sample people:', person1, person2, person3);

  // Check if a document exists
  const exists = await datastore.existsDocument('Person', 'http://example.org/people/john-doe');
  console.log('✅ John Doe exists:', exists);

  // Load a document
  const johnDoe = await datastore.loadDocument('Person', 'http://example.org/people/john-doe');
  console.log('🔍 Loaded John Doe:', johnDoe);

  // List all documents
  const allPeople = await datastore.listDocuments('Person');
  console.log(`📋 All people (${allPeople.length}):`, allPeople.map(p => p.name));

  // Find documents by search
  const searchResults = await datastore.findDocuments('Person', { search: 'doe' });
  console.log(`🔎 Search for 'doe' (${searchResults.length}):`, searchResults.map(p => p.name));

  // Find with sorting
  const sortedResults = await datastore.findDocuments('Person', {
    sorting: [{ id: 'age', desc: true }]
  });
  console.log('📊 Sorted by age (desc):', sortedResults.map(p => `${p.name} (${p.age})`));

  // Find with pagination
  const pagedResults = await datastore.findDocuments('Person', {
    pagination: { pageIndex: 0, pageSize: 2 }
  });
  console.log('📄 First page (2 items):', pagedResults.map(p => p.name));

  // Count documents
  const count = await datastore.countDocuments?.('Person', {}) || 0;
  console.log('🔢 Total people count:', count);

  // Find entities
  const entities = await datastore.findEntityByTypeName?.('Person', 'doe', 10) || [];
  console.log('🏷️ Entities matching "doe":', entities.map(e => e.label));

  // Remove a document
  const removed = await datastore.removeDocument('Person', 'http://example.org/people/john-doe');
  console.log('🗑️ Removed John Doe:', removed);

  // List documents after removal
  const remainingPeople = await datastore.listDocuments('Person');
  console.log(`👥 Remaining people (${remainingPeople.length}):`, remainingPeople.map(p => p.name));

  // Clean up
  clearLocalStore();
  console.log('🧹 Store cleaned up');
}

// Run the example
runExample().catch(console.error); 