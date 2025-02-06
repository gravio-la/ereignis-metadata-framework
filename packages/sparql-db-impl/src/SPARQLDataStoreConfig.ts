import {
  CRUDFunctions,
  SparqlBuildOptions,
  StringToIRIFn,
} from "@graviola/edb-core-types";
import { WalkerOptions } from "@graviola/edb-graph-traversal";
import { JSONSchema7 } from "json-schema";
import { DatastoreBaseConfig } from "@graviola/edb-global-types";

export type SPARQLDataStoreConfig = {
  defaultPrefix: string;
  jsonldContext: object | string;
  typeNameToTypeIRI: StringToIRIFn;
  queryBuildOptions: SparqlBuildOptions;
  walkerOptions?: Partial<WalkerOptions>;
  sparqlQueryFunctions: CRUDFunctions;
  defaultLimit?: number;
  makeStubSchema?: (schema: JSONSchema7) => JSONSchema7;
} & DatastoreBaseConfig;
