# @graviola/edb-core-types

Core TypeScript type definitions for the Graviola framework.

![Environment: Universal](https://img.shields.io/badge/Environment-Universal-green)

## Overview

This package provides essential TypeScript type definitions used throughout the Graviola framework. It defines the core data structures, interfaces, and types for working with RDF data, SPARQL queries, entity management, and application settings.

## Ecosystem Integration

### Position in the Graviola Framework

The core-types package is a foundational component of the Graviola framework, providing type definitions that are used across almost all other packages. It establishes a common type system for working with RDF data, SPARQL endpoints, entity definitions, and more. This package is essential for maintaining type safety and consistency throughout the framework.

### Dependency Graph

```mermaid
flowchart TD
    A[graviola/edb-core-types] --> B[@rdfjs/types]
    A --> C[@rdfjs/namespace]
    D[graviola/sparql-schema] --> A
    E[graviola/core-utils] --> A
    F[graviola/state-hooks] --> A
    G[graviola/data-mapping] --> A
    H[graviola/prisma-db-impl] --> A
    I[graviola/sparql-db-impl] --> A
    J[graviola/remote-query] --> A
    K[graviola/entity-finder] --> A
    L[many other packages...] --> A

    style A fill:#f9f,stroke:#333,stroke-width:2px
```

### Package Relationships

- **Peer Dependencies**:

  - `@rdfjs/namespace`: RDF/JS namespace builder
  - `@rdfjs/types`: RDF/JS type definitions

- **Used By**:
  - Most packages in the Graviola framework, including:
    - `@graviola/sparql-schema`: For SPARQL and RDF type definitions
    - `@graviola/core-utils`: For entity and data structure types
    - `@graviola/state-hooks`: For state management types
    - `@graviola/data-mapping`: For field mapping types
    - `@graviola/prisma-db-impl`: For database implementation types
    - `@graviola/sparql-db-impl`: For SPARQL database implementation types
    - `@graviola/remote-query`: For remote query types
    - And many more...

## Installation

```bash
bun add @graviola/edb-core-types
# or
npm install @graviola/edb-core-types
# or
yarn add @graviola/edb-core-types
```

## Features

### RDF and SPARQL Types

- **Prefixes**: Type definitions for RDF prefixes and namespace builders
- **SparqlEndpoint**: Interface for SPARQL endpoint configuration
- **SPARQLFlavour**: Type for different SPARQL implementation flavors
- **CRUDFunctions**: Interface for CRUD operations on RDF data
- **RDFSelectResult**: Type for SPARQL SELECT query results
- **QueryOptions**: Type for SPARQL query options

### Entity Types

- **NamedEntityData**: Interface for entities with an ID
- **NamedAndTypedEntity**: Interface for entities with an ID and type
- **Entity**: Comprehensive entity interface with label, description, and image
- **BasicThingInformation**: Simplified entity information for UI display

### Field Extraction and Mapping

- **FieldExtractDeclaration**: Type for field extraction definitions
- **PrimaryField**: Interface for primary entity fields (label, description, image)
- **PrimaryFieldExtract**: Interface for extracting primary fields from entities
- **PrimaryFieldResults**: Interface for extraction results

### Settings and Configuration

- **Settings**: Interface for application settings
- **Features**: Interface for feature flags
- **SparqlEndpoint**: Interface for SPARQL endpoint configuration
- **OpenAIConfig**: Interface for OpenAI integration settings
- **GoogleDriveConfig**: Interface for Google Drive integration settings
- **ExternalAuthorityConfig**: Interface for external authority configuration

### Utility Types

- **Permission**: Interface for view/edit permissions
- **PermissionDeclaration**: Type for declaring permissions by entity type
- **ColumnDesc**: Type for column descriptions
- **WalkerOptions**: Options for graph traversal
- **AutocompleteSuggestion**: Type for autocomplete suggestions

## Usage

Import types from this package in your TypeScript files:

```typescript
import type {
  NamedAndTypedEntity,
  SparqlEndpoint,
  PrimaryField,
} from "@graviola/edb-core-types";

// Define a typed entity
const person: NamedAndTypedEntity = {
  "@id": "http://example.org/person/1",
  "@type": "http://example.org/ontology#Person",
  name: "John Doe",
  age: 30,
};

// Configure a SPARQL endpoint
const endpoint: SparqlEndpoint = {
  label: "Local Oxigraph",
  endpoint: "http://localhost:7878/query",
  active: true,
  provider: "oxigraph",
};

// Define primary fields for an entity type
const personFields: PrimaryField = {
  label: "name",
  description: "bio",
  image: "photo",
};
```

### Settings Types

Import settings types for application configuration:

```typescript
import type { Settings, Features } from "@graviola/edb-core-types/settings";

// Define application features
const features: Features = {
  enablePreview: true,
  enableDebug: false,
  enableBackdrop: true,
  enableStylizedCard: true,
};

// Define application settings
const settings: Settings = {
  lockedEndpoint: false,
  sparqlEndpoints: [
    {
      label: "Local Oxigraph",
      endpoint: "http://localhost:7878/query",
      active: true,
      provider: "oxigraph",
    },
  ],
  features,
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  googleDrive: {},
  externalAuthority: {},
};
```

## Internal Usage

This package is used throughout the Graviola framework to provide type definitions. Here's an example from the sparql-schema package:

```typescript
// From packages/sparql-schema/src/crud/load.ts
import type {
  CRUDFunctions,
  NamedAndTypedEntity,
  SPARQLCRUDOptions,
} from "@graviola/edb-core-types";
import { JSONSchema7 } from "json-schema";

export async function load({
  entityIRI,
  typeIRI,
  schema,
  sparqlEndpoint,
  crudFunctions,
  options,
}: {
  entityIRI: string;
  typeIRI: string;
  schema: JSONSchema7;
  sparqlEndpoint: string;
  crudFunctions?: CRUDFunctions;
  options?: SPARQLCRUDOptions;
}): Promise<NamedAndTypedEntity> {
  // Implementation...
}
```

## License

This package is part of the Graviola project.
