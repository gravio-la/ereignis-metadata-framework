import type { AbstractDatastore } from "@graviola/edb-global-types";
import { useCrudProvider } from "./provider";

type UseDataStoreState = {
  dataStore?: AbstractDatastore;
  ready: boolean;
};

export const useDataStore = (): UseDataStoreState => {
  const { dataStore, isReady } = useCrudProvider();
  return {
    dataStore,
    ready: Boolean(isReady),
  };
};
