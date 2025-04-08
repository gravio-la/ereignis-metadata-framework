import type { SparqlEndpoint } from "@graviola/edb-core-types";
import { CrudProviderContext, useAdbContext } from "@graviola/edb-state-hooks";
import { initRestfullStore } from "@graviola/restfull-fetch-db-impl";
import { type FunctionComponent, type ReactNode, useMemo } from "react";

export type RestStoreProviderProps = {
  children: ReactNode;
  endpoint: SparqlEndpoint;
  defaultLimit: number;
  requestOptions?: RequestInit;
};
export const RestStoreProvider: FunctionComponent<RestStoreProviderProps> = ({
  children,
  endpoint,
  defaultLimit,
  requestOptions,
}) => {
  const {
    schema,
    typeNameToTypeIRI,
    jsonLDConfig: { defaultPrefix },
  } = useAdbContext();
  const dataStore = useMemo(() => {
    return initRestfullStore({
      apiURL: endpoint.endpoint,
      defaultPrefix: defaultPrefix,
      typeNameToTypeIRI,
      schema,
      defaultLimit,
      requestOptions,
    });
  }, [endpoint, defaultLimit, defaultPrefix, typeNameToTypeIRI, schema, requestOptions]);
  return (
    <CrudProviderContext.Provider
      value={{ crudOptions: null, dataStore, isReady: Boolean(dataStore) }}
    >
      {children}
    </CrudProviderContext.Provider>
  );
};
