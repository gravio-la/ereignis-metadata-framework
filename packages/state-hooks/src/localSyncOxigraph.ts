import datasetFactory from "@rdfjs/dataset";
import { Quad } from "@rdfjs/types";
import { SparqlEndpoint, CRUDFunctions } from "@graviola/edb-core-types";
import { useOxigraph } from "./useOxigraph";
import { useMemo } from "react";
import type { Store } from "oxigraph/web";

export const makeLocalWorkerCrudOptions: (
  store: Store | undefined,
) => (endpoint: SparqlEndpoint) => CRUDFunctions = (
  store: Store | undefined,
) => {
  return (_) =>
    ({
      askFetch: async (query) => Boolean(store?.query(query)),
      // @ts-ignore
      constructFetch: async (query) => {
        const quads = store?.query(query) || [];
        let ds = datasetFactory.dataset();
        try {
          ds = datasetFactory.dataset(quads as Quad[]);
        } catch (e: any) {
          throw new Error("unable to parse the data" + e.message);
        }

        return ds;
      },
      updateFetch: async (query) => {
        store?.update(query);
      },
      selectFetch: async (query, options) => {
        const sparqlResult = JSON.parse(
          (store?.query(query, {
            results_format: "application/sparql-results+json",
          }) as string) || "{}",
        );

        return options?.withHeaders
          ? sparqlResult
          : sparqlResult.results.bindings;
      },
    }) as CRUDFunctions;
};

export const useSyncLocalWorkerCrudOptions: () =>
  | ((endpoint: SparqlEndpoint) => CRUDFunctions)
  | undefined = () => {
  const { oxigraph } = useOxigraph();
  return useMemo(
    () => makeLocalWorkerCrudOptions(oxigraph?.ao as Store | undefined),
    [oxigraph?.ao],
  );
};
