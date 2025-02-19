import { useMemo } from "react";
import { useSettings } from "./useLocalSettings";
import { useOxigraph } from "./useOxigraph";
import { CRUDFunctions, SparqlEndpoint } from "@graviola/edb-core-types";
import {
  allegroCrudOptions,
  oxigraphCrudOptions,
  qleverCrudOptions,
} from "@graviola/remote-query-implementations";
import { useAsyncLocalWorkerCrudOptions } from "./localAsyncOxigraph";
import { useSyncLocalWorkerCrudOptions } from "./localSyncOxigraph";
import { isAsyncOxigraph } from "./useRDFDataSources";

type UseGlobalCRUDOptions = () => {
  crudOptions?: CRUDFunctions;
};

const workerProvider: Record<
  SparqlEndpoint["provider"],
  (endpointConfig: SparqlEndpoint) => CRUDFunctions | null
> = {
  oxigraph: oxigraphCrudOptions,
  allegro: allegroCrudOptions,
  qlever: qleverCrudOptions,
  virtuoso: oxigraphCrudOptions,
  blazegraph: oxigraphCrudOptions,
  worker: null,
  rest: null,
};

export const useGlobalCRUDOptions: UseGlobalCRUDOptions = () => {
  const { activeEndpoint } = useSettings();
  const { oxigraph } = useOxigraph();
  const localWorkerCrudOptions = isAsyncOxigraph(oxigraph?.ao)
    ? useAsyncLocalWorkerCrudOptions()
    : useSyncLocalWorkerCrudOptions();

  const crudOptions = useMemo<CRUDFunctions | undefined>(() => {
    const allProviders = {
      ...workerProvider,
      worker: localWorkerCrudOptions,
    };
    return (
      activeEndpoint &&
      allProviders[activeEndpoint.provider] &&
      allProviders[activeEndpoint.provider](activeEndpoint)
    );
  }, [localWorkerCrudOptions, activeEndpoint]);
  return {
    crudOptions,
  };
};
