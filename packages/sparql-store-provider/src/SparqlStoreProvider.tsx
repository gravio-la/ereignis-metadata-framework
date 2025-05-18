import type { CRUDFunctions, SparqlEndpoint } from "@graviola/edb-core-types";
import { CrudProviderContext, useAdbContext } from "@graviola/edb-state-hooks";
import { initSPARQLStore } from "@graviola/sparql-db-impl";
import { type FunctionComponent, type ReactNode, useMemo } from "react";

import { tripleStoreImplementations } from "./tripleStoreImplementations";

export type SparqlStoreProviderProps = {
  children: ReactNode;
  endpoint: SparqlEndpoint;
  defaultLimit: number;
};
export const SparqlStoreProvider: FunctionComponent<
  SparqlStoreProviderProps
> = ({ children, endpoint, defaultLimit }) => {
  const crudOptions = useMemo<CRUDFunctions | null>(() => {
    return tripleStoreImplementations[endpoint.provider](endpoint);
  }, [endpoint]);

  const {
    schema,
    typeNameToTypeIRI,
    queryBuildOptions,
    jsonLDConfig: { defaultPrefix, jsonldContext },
    makeStubSchema,
  } = useAdbContext();

  const dataStore = useMemo(() => {
    return initSPARQLStore({
      defaultPrefix,
      jsonldContext,
      typeNameToTypeIRI,
      queryBuildOptions,
      walkerOptions: {},
      sparqlQueryFunctions: crudOptions,
      schema,
      defaultLimit,
      makeStubSchema,
    });
  }, [
    crudOptions,
    schema,
    typeNameToTypeIRI,
    queryBuildOptions,
    defaultPrefix,
    jsonldContext,
    defaultLimit,
  ]);

  return (
    <CrudProviderContext.Provider
      value={{ crudOptions, dataStore, isReady: Boolean(dataStore) }}
    >
      {children}
    </CrudProviderContext.Provider>
  );
};
