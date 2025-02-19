import datasetFactory from "@rdfjs/dataset";
import N3 from "n3";
import { Quad } from "@rdfjs/types";
import { ResponseMimetype, WorkerResult } from "@graviola/async-oxigraph";
import { SparqlEndpoint, CRUDFunctions } from "@graviola/edb-core-types";
import { useGlobalCRUDOptions } from "./useGlobalCRUDOptions";
import { useOxigraph } from "./useOxigraph";
import { useCallback, useMemo } from "react";

type DoQuery = (
  query: string,
  mimeType?: ResponseMimetype,
) => Promise<WorkerResult>;
export const makeLocalWorkerCrudOptions: (
  doQuery: DoQuery,
) => (endpoint: SparqlEndpoint) => CRUDFunctions = (doQuery: DoQuery) => {
  return (_) =>
    ({
      askFetch: async (query) => Boolean(await doQuery(query)),
      // @ts-ignore
      constructFetch: async (query) => {
        console.time("constructFetch query");
        const result = await doQuery(query);
        console.timeEnd("constructFetch query");

        let ds = datasetFactory.dataset();
        if (!result?.data) {
          if (result?.error) {
            console.error("Error returned from query", query, result.error);
          }
          return ds;
        }

        try {
          console.time("constructFetch parsing");
          const parser = new N3.Parser();
          const quads = parser.parse(result.data);
          ds = datasetFactory.dataset(quads);
          console.timeEnd("constructFetch parsing");
        } catch (e: any) {
          throw new Error("unable to parse the data" + e.message);
        }
        return ds;
      },
      updateFetch: async (query) => {
        const result = await doQuery(query);
        return result?.data;
      },
      selectFetch: async (query, options) => {
        console.time("selectFetch query");
        const result = await doQuery(query);
        console.timeEnd("selectFetch query");
        return options?.withHeaders
          ? result?.data
          : result?.data?.results?.bindings;
      },
    }) as CRUDFunctions;
};

export const useAsyncLocalWorkerCrudOptions: () => (
  endpoint: SparqlEndpoint,
) => CRUDFunctions = () => {
  const { oxigraph } = useOxigraph();
  const doQuery = useCallback(
    async (query: string, mimeType?: ResponseMimetype) => {
      if (!oxigraph) {
        throw new Error("Oxigraph not initialized");
      }
      return (await oxigraph.ao.query(query, mimeType)) as WorkerResult;
    },
    [oxigraph],
  );
  return useMemo(() => makeLocalWorkerCrudOptions(doQuery), [doQuery]);
};
