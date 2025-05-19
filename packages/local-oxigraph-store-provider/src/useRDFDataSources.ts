import { AsyncOxigraph, RDFMimetype } from "@graviola/async-oxigraph";
import { useQuery } from "@tanstack/react-query";
import type { Store } from "oxigraph/web";
import { useCallback, useEffect, useState } from "react";

import { isAsyncOxigraph } from "./isAsyncOxigraph";
import { useOxigraph } from "./useOxigraph";

/**
 * Load RDF data sources into local in memory Oxigraph store
 *
 * @param source URL to RDF data source
 * @param baseIRI Base IRI for the RDF data source
 */
export const useRDFDataSources = (source: string, baseIRI: string) => {
  const { oxigraph } = useOxigraph();
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkLoaded, setBulkLoaded] = useState(false);
  const { data } = useQuery({
    queryKey: ["knowledge", source],
    queryFn: () => fetch(source).then((r) => r.text()),
  });

  const load = useCallback(
    async (ao: AsyncOxigraph | Store) => {
      setBulkLoading(true);
      if (isAsyncOxigraph(ao)) {
        console.log("load async");
        await ao.load(data, RDFMimetype.TURTLE, baseIRI);
      } else {
        ao.load(data, {
          format: RDFMimetype.TURTLE,
          base_iri: baseIRI,
        });
      }
      setBulkLoading(false);
      setBulkLoaded(true);
    },
    [setBulkLoading, setBulkLoaded, data, baseIRI],
  );

  useEffect(() => {
    if (!data || !oxigraph) return;
    load(oxigraph.ao);
  }, [oxigraph, data, load]);

  return {
    bulkLoading,
    bulkLoaded,
  };
};
