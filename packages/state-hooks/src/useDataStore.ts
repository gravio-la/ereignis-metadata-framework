import type { AbstractDatastore } from "@graviola/edb-global-types";
import type { JSONSchema7 } from "json-schema";
import {
  CRUDFunctions,
  SparqlBuildOptions,
  StringToIRIFn,
  WalkerOptions,
} from "@graviola/edb-core-types";
import { useCrudProvider } from "./provider";

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
  const { dataStore, isReady } = useCrudProvider();
  return {
    dataStore,
    ready: Boolean(isReady),
  };
};
