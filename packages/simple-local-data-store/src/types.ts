import type { JSONSchema7 } from "json-schema";
import type { StringToIRIFn, IRIToStringFn } from "@graviola/edb-core-types";

/**
 * Configuration for the Simple Local Data Store
 */
export interface SimpleLocalDataStoreConfig {
  /**
   * The JSON schema that defines the data model
   */
  schema: JSONSchema7;
  
  /**
   * Function to convert a type name to its IRI representation
   */
  typeNameToTypeIRI: StringToIRIFn;
  
  /**
   * Function to convert an IRI to its type name representation
   */
  typeIRItoTypeName: IRIToStringFn;
  
  /**
   * Default limit for queries when not specified
   */
  defaultLimit?: number;
}

/**
 * Main store structure that keeps the data organized by type and entity ID
 */
export interface StoreData {
  /**
   * Documents are organized by type and then by entity ID
   * { typeName: { entityIRI: document } }
   */
  documents: Record<string, Record<string, any>>;
} 