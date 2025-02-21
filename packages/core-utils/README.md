# @graviola/core-utils

A collection of utility functions used across the Graviola project. This package provides common helper functions for string manipulation, data transformation, date handling, and more.

## Installation

```bash
npm install @graviola/core-utils
# or
yarn add @graviola/core-utils
# or
bun add @graviola/core-utils
```

## Features

### String Manipulation

- `camelCaseToTitleCase`: Convert camelCase strings to Title Case

  ```typescript
  camelCaseToTitleCase("helloWorld"); // "Hello World"
  ```

- `ellipsis`: Truncate text with an ellipsis

  ```typescript
  ellipsis("Long text to truncate", 10); // "Long text…"
  ```

- `leftpad`: Pad numbers with leading characters
  ```typescript
  leftpad(5, 3); // "005"
  leftpad(7, 4, "x"); // "xxx7"
  ```

### Date Handling

- `specialDate` utilities for working with numeric date representations (YYYYMMDD format)
  ```typescript
  getDatePart(20230915, "year"); // 2023
  getPaddedDate(new Date("2023-09-15")); // "20230915"
  ```

### Data Transformation

- `filterJSONLD`: Remove JSON-LD specific properties from objects
- `replaceJSONLD`: Replace JSON-LD property markers with custom strings
- `foldInner2Outer`: Transform nested object structures
- `resolveObj`: Safely access nested object properties

### Markdown Processing

- `parseMarkdownLinks`: Extract links from markdown text
  ```typescript
  parseMarkdownLinks("[Google](https://google.com)");
  // [{ label: "Google", url: "https://google.com" }]
  ```

### Color Utilities

- `hexToRGBA`: Convert hex color codes to RGBA format
  ```typescript
  hexToRGBA("#ff0000", 0.5); // "rgba(255, 0, 0, 0.5)"
  ```

### SPARQL/RDF Utilities

- `envToSparqlEndpoint`: Convert environment variables to SPARQL endpoint configuration
- `encodeIRI/decodeIRI`: Encode/decode IRIs for safe transmission

### Array/Object Utilities

- `filterUndefOrNull`: Remove undefined and null values from arrays
- `makeColumnDesc`: Generate column descriptors with letter indices
- `index2letter`: Convert numeric indices to spreadsheet-style column letters (A, B, C, ...)

## Usage

```typescript
import {
  camelCaseToTitleCase,
  ellipsis,
  hexToRGBA,
  parseMarkdownLinks,
} from "@graviola/core-utils";

// Convert camelCase to Title Case
const title = camelCaseToTitleCase("myVariableName");
// => "My Variable Name"

// Truncate long text
const truncated = ellipsis("This is a very long text", 10);
// => "This is a…"

// Convert hex color to rgba
const color = hexToRGBA("#ff0000", 0.5);
// => "rgba(255, 0, 0, 0.5)"

// Parse markdown links
const links = parseMarkdownLinks("[Link](https://example.com)");
// => [{ label: "Link", url: "https://example.com" }]
```

## License

This package is part of the Graviola project.
