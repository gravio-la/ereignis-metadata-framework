# @graviola/edb-graph-traversal

This package provides utilities for traversing RDF graphs and extracting structured data according to JSON Schema definitions. It's a core component of the EDB Framework that bridges the gap between semantic graph data and structured JSON objects.

## Overview

The graph traversal package enables you to:

1. Convert RDF nodes to property trees
2. Find specific properties within these trees
3. Extract structured JSON data from RDF graphs based on JSON Schema definitions

This functionality is particularly useful when working with semantic data that needs to be consumed by applications expecting structured JSON.

## Installation

```bash
npm install @graviola/edb-graph-traversal
# or
yarn add @graviola/edb-graph-traversal
# or
bun add @graviola/edb-graph-traversal
```

## Core Functions

### `nodeToPropertyTree`

Converts an RDF node to a hierarchical property tree structure.

```typescript
import { nodeToPropertyTree } from "@graviola/edb-graph-traversal";

const propertyTree = nodeToPropertyTree(node, dataset, level, maxDepth);
```

### `findFirstInProps`

Finds the first value of a property in a property tree.

```typescript
import { findFirstInProps } from '@graviola/edb-graph-traversal';

const value = findFirstInProps(propertyTree, predicate1, predicate2, ...);
```

### `traverseGraphExtractBySchema`

The main function that extracts structured JSON data from an RDF graph based on a JSON Schema definition.

```typescript
import { traverseGraphExtractBySchema } from "@graviola/edb-graph-traversal";

const jsonData = traverseGraphExtractBySchema(
  baseIRI,
  entityIRI,
  dataset,
  schema,
  options,
);
```

## Usage Example

Here's a complete example of extracting structured data from an RDF graph:

```typescript
import { traverseGraphExtractBySchema } from "@graviola/edb-graph-traversal";
import datasetFactory from "@rdfjs/dataset";
import { Parser } from "n3";

// Define your schema
const personSchema = {
  type: "object",
  definitions: {
    Person: {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        email: { type: "string" },
        knows: {
          type: "array",
          items: {
            $ref: "#/definitions/Person",
          },
        },
      },
    },
  },
  properties: {},
};
personSchema.properties = personSchema.definitions.Person.properties;

// Load your RDF data
async function loadDataset(turtleData) {
  const parser = new Parser();
  const dataset = await parser.parse(turtleData);
  return datasetFactory.dataset(dataset);
}

// Extract structured data
async function extractPersonData() {
  const turtleData = `
    @prefix schema: <http://schema.org/> .
    @prefix ex: <http://example.com/> .
    
    ex:person1 a schema:Person ;
      schema:name "John Doe" ;
      schema:age 30 ;
      schema:email "john@example.com" ;
      schema:knows ex:person2 .
      
    ex:person2 a schema:Person ;
      schema:name "Jane Smith" .
      schema:knows ex:person1 .
  `;

  const dataset = await loadDataset(turtleData);

  const result = traverseGraphExtractBySchema(
    "http://schema.org/",
    "http://example.com/person1",
    dataset,
    personSchema,
    {
      omitEmptyArrays: true,
      omitEmptyObjects: true,
      maxRecursion: 3,
    },
  );
  e;
  console.log(JSON.stringify(result, null, 2));
}

extractPersonData();
```

## Configuration Options

The `traverseGraphExtractBySchema` function accepts the following options:

| Option                   | Type    | Description                                            |
| ------------------------ | ------- | ------------------------------------------------------ |
| `omitEmptyArrays`        | boolean | If true, empty arrays will be omitted from the result  |
| `omitEmptyObjects`       | boolean | If true, empty objects will be omitted from the result |
| `maxRecursion`           | number  | Maximum recursion depth for the entire traversal       |
| `maxRecursionEachRef`    | number  | Maximum recursion depth for each schema reference      |
| `skipAtLevel`            | number  | Level at which to stop traversing properties           |
| `doNotRecurseNamedNodes` | boolean | If true, named nodes will not be recursively traversed |

## Advanced Usage

### Handling Circular References

The traversal algorithm automatically handles circular references in your schema by tracking the recursion depth for each schema reference.

### Type Conversion

The traversal process automatically converts RDF literal values to the appropriate JavaScript types based on the schema:

- `string` → JavaScript string
- `number` → JavaScript number (float via parseFloat)
- `integer` → JavaScript number (integer via parseInt)
- `boolean` → JavaScript boolean (true if value is "true")
- `object` → JavaScript empty object ({})
- `array` → JavaScript empty array ([])

When processing array items, the conversion happens based on the schema's type definition. The conversion logic examines the schema.items.type property and applies the appropriate transformation to each value in the array. This ensures that all data retrieved from the RDF graph is properly typed according to your JSON Schema definition.

### Metadata Preservation

The extracted JSON includes RDF metadata:

- `@id` - The IRI of the node
- `@type` - The RDF type of the node

## Integration with React Components

The package can be easily integrated with React components to display RDF data in a structured way. See the `DeepGraphToJSONShowcase` component in the EDB Framework for an example.

## Use Cases

- Converting RDF data from SPARQL endpoints to structured JSON
- Building form-based UIs on top of semantic data
- Extracting specific subgraphs from larger RDF datasets
- Transforming between different data models while preserving semantics

## License

MIT
