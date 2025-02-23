import type {
  IRIToStringFn,
  SparqlEndpoint,
  StringToIRIFn,
  WalkerOptions,
  Entity,
} from "@graviola/edb-core-types";
import type { NamespaceBuilder } from "@rdfjs/namespace";
import type { JsonLdContext } from "jsonld-context-parser";
import type { JSONSchema7 } from "json-schema";

export type EdbConfRaw = {
  BASE_IRI: string;
  namespaceBase: string;
  walkerOptions: Partial<WalkerOptions>;
  defaultPrefix: string;
  defaultJsonldContext: object;
  defaultQueryBuilderOptions: {
    prefixes: Record<string, string | NamespaceBuilder>;
  };
  sparqlEndpoint: SparqlEndpoint;
};
export type Config = Omit<EdbConfRaw, "namespaceBase"> & {
  namespace: NamespaceBuilder<string>;
};

export type SimplifiedEndpointConfig = {
  baseIRI: string;
  entityBaseIRI: string;
  endpoint: SparqlEndpoint;
  jsonldContext?: object;
};

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type QueryType = {
  sorting?: {
    id: string;
    desc?: boolean;
  }[];
  search?: string;
  pagination?: PaginationState;
  fields?: string[];
};

export type DatastoreBaseConfig = {
  schema: JSONSchema7;
};

export type InitDatastoreFunction<T extends DatastoreBaseConfig> = (
  dataStoreConfig: T,
) => AbstractDatastore;

export type CountAndIterable<DocumentResult> = {
  amount: number;
  iterable: AsyncIterable<DocumentResult>;
};

export type AbstractDatastoreIterable<DocumentResult> = {
  listDocuments: (
    typeName: string,
    limit?: number,
  ) => Promise<CountAndIterable<DocumentResult>>;
  findDocuments: (
    typeName: string,
    query: QueryType,
    limit?: number,
  ) => Promise<CountAndIterable<DocumentResult>>;
};

export type AbstractDatastore<
  UpsertResult = any,
  LoadResult = any,
  FindResult = any[],
  RemoveResult = any,
  DocumentResult = LoadResult,
  ImportResult = any,
  BulkImportResult = any,
> = {
  typeNameToTypeIRI: StringToIRIFn;
  typeIRItoTypeName: IRIToStringFn;
  removeDocument: (
    typeName: string,
    entityIRI: string,
  ) => Promise<RemoveResult>;
  importDocument: (
    typeName: string,
    entityIRI: any,
    importStore: AbstractDatastore,
  ) => Promise<ImportResult>;
  importDocuments: (
    typeName: string,
    importStore: AbstractDatastore,
    limit: number,
  ) => Promise<BulkImportResult>;
  loadDocument: (typeName: string, entityIRI: string) => Promise<LoadResult>;
  existsDocument: (typeName: string, entityIRI: string) => Promise<boolean>;
  upsertDocument: (
    typeName: string,
    entityIRI: string,
    document: any,
  ) => Promise<UpsertResult>;
  listDocuments: (
    typeName: string,
    limit?: number,
    cb?: (document: any) => Promise<any>,
  ) => Promise<FindResult>;
  findDocuments: (
    typeName: string,
    query: QueryType,
    limit?: number,
    cb?: (document: any) => Promise<DocumentResult>,
  ) => Promise<FindResult>;
  findEntityByTypeName?: (
    typeName: string,
    searchString: string,
    limit?: number,
  ) => Promise<Entity[]>;
  findDocumentsByLabel?: (
    typeName: string,
    label: string,
    limit?: number,
  ) => Promise<FindResult>;
  findDocumentsByAuthorityIRI?: (
    typeName: string,
    authorityIRI: string,
    repositoryIRI?: string,
    limit?: number,
  ) => Promise<FindResult>;
  findDocumentsAsFlatResultSet?: (
    typeName: string,
    query: QueryType,
    limit?: number,
  ) => Promise<any>;
  countDocuments?: (typeName: string, query: QueryType) => Promise<number>;
  getClasses?: (entityIRI: string) => Promise<string[]>;
  iterableImplementation?: AbstractDatastoreIterable<DocumentResult>;
};

export type JSONLDConfig = {
  defaultPrefix: string;
  jsonldContext?: JsonLdContext;
  allowUnsafeSourceIRIs?: boolean;
};
