import { CRUDFunctions, SparqlEndpoint } from "@graviola/edb-core-types";
import { AbstractDatastore } from "@graviola/edb-global-types";
import { createContext, useContext } from "react";

type CrudProviderContextValue = {
  crudOptions: CRUDFunctions | null;
  dataStore: AbstractDatastore;
  isReady: boolean;
};

export const CrudProviderContext =
  createContext<CrudProviderContextValue>(null);

export const useCrudProvider = () => {
  const context = useContext(CrudProviderContext);
  if (!context) {
    throw new Error("useCrudProvider must be used within a CrudProvider");
  }
  return context;
};
