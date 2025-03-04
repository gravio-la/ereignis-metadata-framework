import { SparqlEndpoint } from "@graviola/edb-core-types";
import { CrudProviderContext, useAdbContext } from "@graviola/edb-state-hooks";
import { initSPARQLStore } from "@graviola/sparql-db-impl";
import { type FunctionComponent, type ReactNode, useMemo } from "react";

import { isAsyncOxigraph } from "./isAsyncOxigraph";
import { useAsyncLocalWorkerCrudOptions } from "./localAsyncOxigraph";
import { useSyncLocalWorkerCrudOptions } from "./localSyncOxigraph";
import { useOxigraph } from "./useOxigraph";

export type LocalOxigraphStoreProviderProps = {
  children: ReactNode;
  endpoint: SparqlEndpoint;
  defaultLimit: number;
};

export const LocalOxigraphStoreProvider: FunctionComponent<
  LocalOxigraphStoreProviderProps
> = ({ children, endpoint, defaultLimit }) => {
  const { oxigraph } = useOxigraph();
  const asyncCrudOptions = useAsyncLocalWorkerCrudOptions(endpoint);
  const syncCrudOptions = useSyncLocalWorkerCrudOptions(endpoint);
  const crudOptions = isAsyncOxigraph(oxigraph?.ao)
    ? asyncCrudOptions
    : syncCrudOptions;
  const {
    schema,
    typeNameToTypeIRI,
    queryBuildOptions,
    jsonLDConfig: { defaultPrefix, jsonldContext },
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
