import type { CRUDFunctions, SPARQLFlavour } from "@graviola/edb-core-types";
import type { AbstractDatastore, Config } from "@graviola/edb-global-types";
import {
  makeStubSchema,
  primaryFieldExtracts,
  primaryFields,
  schema,
} from "@slub/exhibition-schema";
import type { JSONSchema7 } from "json-schema";

import { initSPARQLStore } from "./initSPARQLStore";

export const initSPARQLDataStoreFromConfig: (
  config: Config,
  crudOptions: CRUDFunctions,
  sparqlFlavour?: SPARQLFlavour,
) => AbstractDatastore = (config, crudOptions, sparqlFlavour) => {
  const {
    namespace,
    walkerOptions,
    defaultPrefix,
    defaultJsonldContext,
    defaultQueryBuilderOptions,
    BASE_IRI,
  } = config;

  const typeNameToTypeIRI = (typeName: string) => namespace(typeName).value;

  const typeIRItoTypeName = (iri: string) => {
    return iri?.substring(BASE_IRI.length, iri.length);
  };
  return initSPARQLStore({
    defaultPrefix,
    jsonldContext: defaultJsonldContext,
    typeNameToTypeIRI,
    queryBuildOptions: {
      prefixes: defaultQueryBuilderOptions.prefixes as Record<string, string>,
      propertyToIRI: typeNameToTypeIRI,
      typeIRItoTypeName,
      primaryFields,
      primaryFieldExtracts,
      sparqlFlavour,
    },
    walkerOptions,
    sparqlQueryFunctions: crudOptions,
    schema: schema as JSONSchema7,
    defaultLimit: 10,
    makeStubSchema: makeStubSchema,
  });
};
