import { initLocalStore, clearLocalStore } from './initLocalStore';
import type { JSONSchema7 } from 'json-schema';
import type { AbstractDatastore } from '@graviola/edb-global-types';

describe('SimpleLocalDataStore', () => {
  let datastore: AbstractDatastore;
  
  // Define sample schema
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

  // IRI mapping functions
  const typeNameToTypeIRI = (typeName: string) => `http://example.org/ontology#${typeName}`;
  const typeIRItoTypeName = (typeIRI: string) => typeIRI.replace('http://example.org/ontology#', '');
  
  // Sample data
  const johnDoeId = 'http://example.org/people/john-doe';
  const janeDoeId = 'http://example.org/people/jane-doe';
  const bobSmithId = 'http://example.org/people/bob-smith';

  beforeEach(() => {
    // Initialize the store before each test
    datastore = initLocalStore({
      schema,
      typeNameToTypeIRI,
      typeIRItoTypeName,
      defaultLimit: 10
    });
  });

  afterEach(() => {
    // Clean up after each test
    clearLocalStore();
  });

  describe('Document Operations', () => {
    test('should create and retrieve documents', async () => {
      // Create a document
      const person = await datastore.upsertDocument(
        'Person',
        johnDoeId,
        {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30
        }
      );

      // Check document structure
      expect(person).toHaveProperty('@id', johnDoeId);
      expect(person).toHaveProperty('@type', 'http://example.org/ontology#Person');
      expect(person).toHaveProperty('name', 'John Doe');

      // Check if document exists
      const exists = await datastore.existsDocument('Person', johnDoeId);
      expect(exists).toBe(true);

      // Load document
      const loadedPerson = await datastore.loadDocument('Person', johnDoeId);
      expect(loadedPerson).toEqual(person);
    });

    test('should throw error when loading non-existent document', async () => {
      await expect(datastore.loadDocument('Person', 'non-existent')).rejects.toThrow();
    });

    test('should remove documents', async () => {
      // Create a document
      await datastore.upsertDocument(
        'Person',
        johnDoeId,
        { name: 'John Doe' }
      );

      // Remove the document
      const removed = await datastore.removeDocument('Person', johnDoeId);
      expect(removed).toBe(true);

      // Check it no longer exists
      const exists = await datastore.existsDocument('Person', johnDoeId);
      expect(exists).toBe(false);
    });
  });

  describe('Query Operations', () => {
    beforeEach(async () => {
      // Add test data
      await datastore.upsertDocument('Person', johnDoeId, { 
        name: 'John Doe', 
        email: 'john@example.com', 
        age: 30 
      });
      
      await datastore.upsertDocument('Person', janeDoeId, { 
        name: 'Jane Doe', 
        email: 'jane@example.com', 
        age: 28 
      });
      
      await datastore.upsertDocument('Person', bobSmithId, { 
        name: 'Bob Smith', 
        email: 'bob@example.com', 
        age: 42 
      });
    });

    test('should list all documents', async () => {
      const people = await datastore.listDocuments('Person');
      expect(people).toHaveLength(3);
      expect(people.map(p => p.name)).toContain('John Doe');
      expect(people.map(p => p.name)).toContain('Jane Doe');
      expect(people.map(p => p.name)).toContain('Bob Smith');
    });

    test('should find documents by search term', async () => {
      const results = await datastore.findDocuments('Person', { search: 'doe' });
      expect(results).toHaveLength(2);
      expect(results.map(p => p.name)).toContain('John Doe');
      expect(results.map(p => p.name)).toContain('Jane Doe');
      expect(results.map(p => p.name)).not.toContain('Bob Smith');
    });

    test('should apply sorting to query results', async () => {
      const sortedResults = await datastore.findDocuments('Person', {
        sorting: [{ id: 'age', desc: true }]
      });
      
      expect(sortedResults).toHaveLength(3);
      expect(sortedResults[0].name).toBe('Bob Smith');  // Oldest first
      expect(sortedResults[1].name).toBe('John Doe');   // Second oldest
      expect(sortedResults[2].name).toBe('Jane Doe');   // Youngest last
    });

    test('should apply pagination to query results', async () => {
      const pagedResults = await datastore.findDocuments('Person', {
        pagination: { pageIndex: 0, pageSize: 2 }
      });
      
      expect(pagedResults).toHaveLength(2);
    });

    test('should count documents', async () => {
      const count = await datastore.countDocuments?.('Person', {});
      expect(count).toBe(3);
    });

    test('should find documents by label', async () => {
      const results = await datastore.findDocumentsByLabel?.('Person', 'doe');
      expect(results).toHaveLength(2);
    });

    test('should find entities by type name', async () => {
      const entities = await datastore.findEntityByTypeName?.('Person', 'doe');
      
      // Make sure we have entities to test
      expect(entities).toBeDefined();
      if (!entities) return;
      
      expect(entities.length).toBe(2);
      
      // Check entity structure
      const entity = entities[0];
      expect(entity).toHaveProperty('entityIRI');
      expect(entity).toHaveProperty('typeIRI');
      expect(entity).toHaveProperty('label');
      expect(entity).toHaveProperty('value');
    });

    test('should return results as flat result set', async () => {
      const resultSet = await datastore.findDocumentsAsFlatResultSet?.('Person', {});
      
      expect(resultSet).toHaveProperty('results.bindings');
      expect(resultSet?.results.bindings).toHaveLength(3);
      expect(resultSet?.head.vars).toContain('entityIRI');
      expect(resultSet?.head.vars).toContain('name');
    });
  });

  describe('Import Operations', () => {
    test('should import document from another store', async () => {
      // Create a source store with data
      const sourceStore = initLocalStore({
        schema,
        typeNameToTypeIRI,
        typeIRItoTypeName
      });
      
      // Add a document to source store
      await sourceStore.upsertDocument('Person', johnDoeId, {
        name: 'John Doe',
        email: 'john@example.com'
      });
      
      // Import the document to our test store
      await datastore.importDocument('Person', johnDoeId, sourceStore);
      
      // Verify it was imported correctly
      const imported = await datastore.loadDocument('Person', johnDoeId);
      expect(imported.name).toBe('John Doe');
    });

    test('should import multiple documents', async () => {
      // Create a source store with data
      const sourceStore = initLocalStore({
        schema,
        typeNameToTypeIRI,
        typeIRItoTypeName
      });
      
      // Add documents to source store
      await sourceStore.upsertDocument('Person', johnDoeId, { name: 'John Doe' });
      await sourceStore.upsertDocument('Person', janeDoeId, { name: 'Jane Doe' });
      
      // Import all documents
      await datastore.importDocuments('Person', sourceStore, 10);
      
      // Verify they were imported correctly
      const people = await datastore.listDocuments('Person');
      expect(people).toHaveLength(2);
    });
  });

  describe('Class Operations', () => {
    test('should get classes for an entity', async () => {
      // Add a document
      await datastore.upsertDocument('Person', johnDoeId, { name: 'John Doe' });
      
      // Get classes
      const classes = await datastore.getClasses?.(johnDoeId);
      expect(classes).toContain('http://example.org/ontology#Person');
    });
  });

  describe('Iterable Implementation', () => {
    test('should provide async iterable for listing documents', async () => {
      // Add test data
      await datastore.upsertDocument('Person', johnDoeId, { name: 'John Doe' });
      await datastore.upsertDocument('Person', janeDoeId, { name: 'Jane Doe' });
      
      // Get iterable
      const iterableResult = await datastore.iterableImplementation?.listDocuments('Person');
      expect(iterableResult?.amount).toBe(2);
      
      // Test iteration
      const results: any[] = [];
      for await (const doc of iterableResult?.iterable || []) {
        results.push(doc);
      }
      
      expect(results).toHaveLength(2);
    });
  });
}); 