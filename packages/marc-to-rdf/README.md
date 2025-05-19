# @graviola/edb-marc-to-rdf

This package provides utilities for converting MARC XML records to RDF (Resource Description Framework) data. It's a specialized component of the EDB Framework that bridges the gap between library catalog data in MARC format and semantic web representations.

## Overview

The marc-to-rdf package enables you to:

1. Parse MARC XML records from library catalogs
2. Map MARC fields and subfields to RDF properties according to configurable mappings
3. Generate RDF triples/quads that represent the bibliographic data
4. Create semantic representations of library resources using standard ontologies

This functionality is particularly useful for integrating library catalog data with semantic web applications and linked data ecosystems.

## Installation

```bash
npm install @graviola/edb-marc-to-rdf
# or
yarn add @graviola/edb-marc-to-rdf
# or
bun add @graviola/edb-marc-to-rdf
```

## Core Functions

### `mapDatafieldToQuads`

Converts a MARC datafield to RDF quads based on the mapping configuration.

```typescript
import { mapDatafieldToQuads } from "@graviola/edb-marc-to-rdf";

const quads = mapDatafieldToQuads(subjectNode, datafield);
```

### `MarcResponseConvert`

Utilities for converting between JSON and typed MARC response objects.

```typescript
import { MarcResponseConvert } from "@graviola/edb-marc-to-rdf";

const marcData = MarcResponseConvert.toSearchRetrieveResponseTypes(jsonString);
```

## Mapping Configuration

The package includes a comprehensive mapping configuration that defines how MARC fields and subfields are converted to RDF properties:

- MARC field 100 → dc:creator with a FOAF:Person entity
- MARC field 245 → dc:title
- MARC field 260 → dc:publisher, dc:date
- MARC field 650 → dc:subject with SKOS:Concept entities
- And many more mappings for standard MARC fields

### Example Mapping

```typescript
// Example of a mapping for MARC field 100 (Author)
"100": {
  subfield: {
    "3": {
      predicate: "DC.creator",
      object: {
        datatype: "uri",
        prefix: "http://data.example.org/person/x"
      },
      relation: {
        subfield: {
          a: {
            predicate: "FOAF.name",
            object: {
              datatype: "literal"
            }
          },
          d: {
            predicate: "DEICH.lifespan",
            object: {
              datatype: "literal"
            }
          }
        },
        class: "FOAF.Person"
      }
    }
  }
}
```

## Advanced Features

### Type Conversion

The mapping process automatically handles different data types:

- Literals are created with appropriate XSD datatypes
- URIs are constructed with configurable prefixes
- Regular expressions can be used to transform values

### Relationship Handling

The mapper can create complex relationships between entities:

- Main bibliographic resource (Work/Manifestation)
- Contributors (Person/Organization)
- Subjects (Concept/Topic)
- Related resources

### Ontology Support

The package supports mapping to multiple standard ontologies:

- Dublin Core (dc)
- FOAF (Friend of a Friend)
- BIBO (Bibliographic Ontology)
- SKOS (Simple Knowledge Organization System)
- FRBR (Functional Requirements for Bibliographic Records)
- And many more specialized vocabularies

## Use Cases

- Converting library catalog data to linked data
- Integrating bibliographic data with semantic web applications
- Creating RDF-based knowledge graphs from MARC records
- Enhancing discovery of library resources through semantic relationships
- Preparing library data for SPARQL querying

## License

MIT
