import { CRUDFunctions, SparqlEndpoint } from "@graviola/edb-core-types";
import {
  allegroCrudOptions,
  oxigraphCrudOptions,
  qleverCrudOptions,
} from "@graviola/remote-query-implementations";

export const tripleStoreImplementations: Record<
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
