import { AbstractDatastore } from "@graviola/edb-global-types";
import { initSPARQLStore } from "@graviola/sparql-db-impl";
import { initRestfullStore } from "@graviola/restfull-fetch-db-impl";
import { JSONSchema7 } from "json-schema";
import { useGlobalCRUDOptions } from "./useGlobalCRUDOptions";
import {
  CRUDFunctions,
  SparqlBuildOptions,
  StringToIRIFn,
  WalkerOptions,
} from "@graviola/edb-core-types";
import { useMemo } from "react";
import { useAdbContext } from "./provider";
import { useSettings } from "./useLocalSettings";

type UserDataStoreProps = {
  crudOptionsPartial?: Partial<CRUDFunctions>;
  schema: JSONSchema7;
  typeNameToTypeIRI: StringToIRIFn;
  queryBuildOptions: SparqlBuildOptions;
  walkerOptions?: Partial<WalkerOptions>;
};

type UseDataStoreState = {
  dataStore?: AbstractDatastore;
  ready: boolean;
};

export const useDataStore = ({
  crudOptionsPartial = {},
  schema,
  typeNameToTypeIRI,
  queryBuildOptions,
  walkerOptions,
}: UserDataStoreProps): UseDataStoreState => {
  const { crudOptions: globalCRUDOptions } = useGlobalCRUDOptions();
  const crudOptions = useMemo(
    () => ({ ...globalCRUDOptions, ...crudOptionsPartial }),
    [globalCRUDOptions, crudOptionsPartial],
  );

  const { activeEndpoint } = useSettings();

  const { jsonLDConfig } = useAdbContext();
  const dataStore = useMemo<AbstractDatastore | undefined>(
    () =>
      activeEndpoint.provider === "rest"
        ? initRestfullStore({
            apiURL: activeEndpoint.endpoint,
            defaultPrefix: jsonLDConfig.defaultPrefix,
            typeNameToTypeIRI,
            schema,
            defaultLimit: 10,
          })
        : crudOptions.constructFetch &&
          initSPARQLStore({
            defaultPrefix: jsonLDConfig.defaultPrefix,
            jsonldContext: jsonLDConfig.jsonldContext,
            typeNameToTypeIRI,
            queryBuildOptions,
            walkerOptions,
            // @ts-ignore
            sparqlQueryFunctions: crudOptions,
            schema,
            defaultLimit: 10,
          }),
    [
      crudOptions,
      jsonLDConfig.defaultPrefix,
      jsonLDConfig.jsonldContext,
      activeEndpoint.provider,
      activeEndpoint.endpoint,
      walkerOptions,
      schema,
      queryBuildOptions,
      typeNameToTypeIRI,
    ],
  );

  return {
    dataStore,
    ready: Boolean(dataStore),
  };
};
