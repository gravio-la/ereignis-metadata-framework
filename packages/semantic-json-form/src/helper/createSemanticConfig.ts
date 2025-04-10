import { GlobalSemanticConfig } from "@graviola/semantic-jsonform-types";
import { IRIToStringFn, StringToIRIFn } from "@graviola/edb-core-types";

type CreateSemanticConfigOptions = {
  baseIRI: string;
  defaultPrefix?: string;
  prefixes?: Record<string, string>;
  override?: Partial<GlobalSemanticConfig>;
  rejectUnknownPrefixes?: boolean;
  rejectUnknownIRIs?: boolean;
};

/**
 * Creates a semantic configuration object for RDF/SPARQL operations with comprehensive IRI handling.
 *
 * This helper function generates a complete GlobalSemanticConfig with sensible defaults,
 * handling IRI conversions, entity creation, and JSON-LD context configuration.
 *
 * @param options - Configuration options for the semantic setup
 * @param options.baseIRI - The base IRI for the application (e.g., 'https://example.com/')
 * @param options.defaultPrefix - The default IRI that will be used for non prefixed properties and types
 *                               (defaults to baseIRI if not specified)
 * @param options.prefixes - A mapping of prefix names to their corresponding IRIs
 *                          (e.g., { 'foaf': 'http://xmlns.com/foaf/0.1/' })
 * @param options.rejectUnknownPrefixes - If true, throws an error when encountering an unknown prefix
 *                                       during field-to-IRI conversion (defaults to false)
 * @param options.rejectUnknownIRIs - If true, throws an error when encountering an IRI that doesn't
 *                                   match any known prefix during IRI-to-field conversion (defaults to false)
 * @param options.override - Optional partial GlobalSemanticConfig to override specific properties
 *                          of the generated configuration
 * @returns A complete GlobalSemanticConfig object with IRI conversion functions, JSON-LD context,
 *          and query building options
 *
 * @example
 * // Basic usage with just a base IRI
 * const config = createSemanticConfig({
 *   baseIRI: 'https://example.com/'
 * });
 *
 * @example
 * // With custom prefixes
 * const config = createSemanticConfig({
 *   baseIRI: 'https://example.com/',
 *   prefixes: {
 *     'foaf': 'http://xmlns.com/foaf/0.1/',
 *     'schema': 'http://schema.org/'
 *   }
 * });
 *
 * @example
 * // With strict validation
 * const config = createSemanticConfig({
 *   baseIRI: 'https://example.com/',
 *   prefixes: { 'foaf': 'http://xmlns.com/foaf/0.1/' },
 *   rejectUnknownPrefixes: true,
 *   rejectUnknownIRIs: true
 * });
 */
export const createSemanticConfig: (
  options: CreateSemanticConfigOptions,
) => GlobalSemanticConfig = ({
  baseIRI,
  defaultPrefix = baseIRI,
  prefixes = {},
  rejectUnknownPrefixes = false,
  rejectUnknownIRIs = false,
  override = {},
}) => {
  // IRI to field name conversion
  const iriToFieldName: IRIToStringFn = (iri: string) => {
    // If IRI starts with defaultPrefix, strip it away
    if (iri.startsWith(defaultPrefix)) {
      return iri.substring(defaultPrefix.length);
    }

    // Check if it matches any of the prefixes
    let bestMatch = "";
    let bestMatchPrefix = "";
    let bestMatchLength = 0;

    for (const [prefix, prefixIRI] of Object.entries(prefixes)) {
      if (iri.startsWith(prefixIRI) && prefixIRI.length > bestMatchLength) {
        bestMatch = iri.substring(prefixIRI.length);
        bestMatchPrefix = prefix;
        bestMatchLength = prefixIRI.length;
      }
    }

    if (bestMatchPrefix) {
      return `${bestMatchPrefix}:${bestMatch}`;
    }

    if (rejectUnknownIRIs) {
      throw new Error(`Unknown IRI: ${iri}`);
    }

    // If no match found, return the original IRI
    return iri;
  };

  // Field name to IRI conversion
  const fieldNameToIRI: StringToIRIFn = (field: string) => {
    // If field contains a colon, it's a prefixed name
    if (field.includes(":")) {
      const [prefix, rest] = field.split(":", 2);
      if (prefixes[prefix]) {
        return `${prefixes[prefix]}${rest}`;
      }

      if (rejectUnknownPrefixes) {
        throw new Error(`Unknown prefix: ${prefix}`);
      }
    }

    // If no prefix or unknown prefix, use defaultPrefix
    return `${defaultPrefix}${field}`;
  };

  // Create entity IRI function
  const createEntityIRI = (typeName: string, id?: string): string => {
    const uuid = id || Math.random().toString(36).substring(2, 15);
    return `${defaultPrefix}${typeName}/${uuid}`;
  };

  return {
    typeNameToTypeIRI: fieldNameToIRI,
    typeIRIToTypeName: iriToFieldName,
    createEntityIRI: createEntityIRI,
    propertyNameToIRI: fieldNameToIRI,
    propertyIRIToPropertyName: iriToFieldName,
    jsonLDConfig: {
      baseIRI,
      defaultPrefix,
      prefixes: { ...prefixes },
      jsonldContext: {
        "@vocab": baseIRI,
        ...Object.assign({}, prefixes),
      },
      ...(override.jsonLDConfig || {}),
    },
    queryBuildOptions: {
      base: baseIRI,
      prefixes: { ...prefixes },
      defaultPrefix,
      propertyToIRI: fieldNameToIRI,
      typeIRItoTypeName: iriToFieldName,
      primaryFields: {},
      primaryFieldExtracts: {},
      ...(override.queryBuildOptions || {}),
    },
    ...override,
  };
};
