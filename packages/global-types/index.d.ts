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
import type { Term } from "@rdfjs/types";

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

export type QueryPagination = {
  pagination: PaginationState;
};

export type QuerySorting = {
  sorting: {
    id: string;
    desc?: boolean;
  }[];
};

export type QuerySearch = {
  search: string;
};

export type QueryFields = {
  fields: string[];
};

export type QueryType = Partial<
  QueryPagination & QuerySorting & QuerySearch & QueryFields
>;

export type DatastoreBaseConfig = {
  schema: JSONSchema7;
};

export type InitDatastoreFunction<
  T extends DatastoreBaseConfig,
  S extends AbstractDatastore = AbstractDatastore,
> = (dataStoreConfig: T) => S;

export type CountAndIterable<DocumentResult> = {
  amount: number;
  iterable: AsyncIterable<DocumentResult>;
};

export type AbstractDatastoreIterable<
  TypeName extends string = string,
  DocumentResultTypeMap extends Record<string, any> = Record<string, any>,
  DocumentResult = any,
> = {
  listDocuments: <T extends TypeName>(
    typeName: T,
    limit?: number,
  ) => Promise<
    CountAndIterable<
      DocumentResultTypeMap[T] extends undefined
        ? DocumentResult
        : DocumentResultTypeMap[T]
    >
  >;
  findDocuments: <T extends TypeName>(
    typeName: T,
    query: QueryType,
    limit?: number,
  ) => Promise<
    CountAndIterable<
      DocumentResultTypeMap[T] extends undefined
        ? DocumentResult
        : DocumentResultTypeMap[T]
    >
  >;
};

export type AbstractDatastore<
  TypeName extends string = string,
  DocumentResultTypeMap extends Record<string, any> = Record<string, any>,
  FindResultTypeMap extends Record<
    string,
    any[]
  > = DocumentResultTypeMap extends undefined
    ? Record<string, any[]>
    : { [K in keyof DocumentResultTypeMap]: DocumentResultTypeMap[K][] },
  UpsertResultTypeMap extends Record<string, any> = DocumentResultTypeMap,
  UpsertDocumentTypeMap extends Record<string, any> = DocumentResultTypeMap,
  RemoveResultTypeMap extends Record<string, any> = DocumentResultTypeMap,
  UpsertResult = any,
  LoadResult = any,
  FindResult = any[],
  RemoveResult = any,
  DocumentResult = LoadResult,
  UpsertDocument = any,
  ImportResult = any,
  BulkImportResult = any,
> = {
  typeNameToTypeIRI: StringToIRIFn;
  typeIRItoTypeName: IRIToStringFn;
  removeDocument: (
    typeName: TypeName,
    entityIRI: string,
  ) => Promise<RemoveResult>;
  importDocument: (
    typeName: TypeName,
    entityIRI: any,
    importStore: AbstractDatastore,
  ) => Promise<ImportResult>;
  importDocuments: (
    typeName: TypeName,
    importStore: AbstractDatastore,
    limit: number,
  ) => Promise<BulkImportResult>;
  loadDocument: <T extends TypeName>(
    typeName: T,
    entityIRI: string,
  ) => Promise<
    DocumentResultTypeMap[T] extends undefined
      ? LoadResult
      : DocumentResultTypeMap[T] | undefined | null
  >;
  existsDocument: (typeName: TypeName, entityIRI: string) => Promise<boolean>;
  upsertDocument: (
    typeName: TypeName,
    entityIRI: string,
    document: UpsertDocumentTypeMap[T] extends undefined
      ? UpsertDocument
      : UpsertDocumentTypeMap[T],
  ) => Promise<
    UpsertResultTypeMap[T] extends undefined
      ? UpsertResult
      : UpsertResultTypeMap[T]
  >;
  listDocuments: <T extends TypeName>(
    typeName: T,
    limit?: number,
    cb?: (
      document: DocumentResultTypeMap[T] extends undefined
        ? DocumentResult
        : DocumentResultTypeMap[T],
    ) => Promise<any>,
  ) => Promise<
    FindResultTypeMap[T] extends undefined ? FindResult : FindResultTypeMap[T]
  >;
  findDocuments: <T extends TypeName>(
    typeName: T,
    query: QueryType,
    limit?: number,
    cb?: (
      document: DocumentResultTypeMap[T] extends undefined
        ? DocumentResult
        : DocumentResultTypeMap[T],
    ) => Promise<any>,
  ) => Promise<
    FindResultTypeMap[T] extends undefined ? FindResult : FindResultTypeMap[T]
  >;
  findEntityByTypeName?: (
    typeName: TypeName,
    searchString: string,
    limit?: number,
  ) => Promise<Entity[]>;
  findDocumentsByLabel?: <T extends TypeName>(
    typeName: T,
    label: string,
    limit?: number,
  ) => Promise<
    FindResultTypeMap[T] extends undefined ? FindResult : FindResultTypeMap[T]
  >;
  findDocumentsByAuthorityIRI?: <T extends TypeName>(
    typeName: T,
    authorityIRI: string,
    repositoryIRI?: string,
    limit?: number,
  ) => Promise<
    FindResultTypeMap[T] extends undefined ? FindResult : FindResultTypeMap[T]
  >;
  findDocumentsAsFlatResultSet?: <T extends TypeName>(
    typeName: T,
    query: QueryType,
    limit?: number,
  ) => Promise<any>;
  countDocuments?: (
    typeName: TypeName,
    query?: Partial<QuerySearch>,
  ) => Promise<number>;
  getClasses?: (entityIRI: string) => Promise<string[]>;
  iterableImplementation?: AbstractDatastoreIterable<
    TypeName,
    DocumentResultTypeMap,
    DocumentResult
  >;
};

export type JSONLDConfig = {
  defaultPrefix: string;
  jsonldContext?: JsonLdContext;
  allowUnsafeSourceIRIs?: boolean;
};

export type RootNode = {
  id: string | number;
  properties: NodePropertyTree;
};

export type NodePropertyTree = {
  [key: string]: NodePropertyItem[];
};

export type NodePropertyItem = {
  value: string;
  term: Term;
  termType: string;
  properties?: NodePropertyTree;
};
