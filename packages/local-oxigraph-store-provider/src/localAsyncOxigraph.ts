import { ResponseMimetype, WorkerResult } from "@graviola/async-oxigraph";
import { CRUDFunctions, SparqlEndpoint } from "@graviola/edb-core-types";
import datasetFactory from "@rdfjs/dataset";
import N3 from "n3";
import { useCallback, useMemo } from "react";

import { useOxigraph } from "./useOxigraph";

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
        const randomId = Math.random().toString(36).substring(2, 15);
        console.time(`constructFetch query ${randomId}`);
        const result = await doQuery(query);
        console.timeEnd(`constructFetch query ${randomId}`);
        console.info({ query, result });

        let ds = datasetFactory.dataset();
        if (!result?.data) {
          if (result?.error) {
            console.error("Error returned from query", query, result.error);
          }
          return ds;
        }

        try {
          console.time(`constructFetch parsing ${randomId}`);
          const parser = new N3.Parser();
          const quads = parser.parse(result.data);
          ds = datasetFactory.dataset(quads);
          console.timeEnd(`constructFetch parsing ${randomId}`);
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
        const randomId = Math.random().toString(36).substring(2, 15);
        console.time(`selectFetch query ${randomId}`);
        const result = await doQuery(query);
        console.timeEnd(`selectFetch query ${randomId}`);
        console.info({ query, result });
        return options?.withHeaders
          ? result?.data
          : result?.data?.results?.bindings;
      },
    }) as CRUDFunctions;
};

export const useAsyncLocalWorkerCrudOptions: (
  endpoint: SparqlEndpoint,
) => CRUDFunctions = (endpoint) => {
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
  return useMemo(
    () => makeLocalWorkerCrudOptions(doQuery)(endpoint),
    [doQuery, endpoint],
  );
};
