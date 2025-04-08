import config, { initSPARQLDataStoreFromConfig } from "@slub/exhibition-sparql-config";
import {
  getProviderOrDefault,
  getSPARQLFlavour,
} from "@graviola/remote-query-implementations";

const worker = getProviderOrDefault(config.sparqlEndpoint);

if (!worker) {
  throw new Error("No worker found for the given SPARQL endpoint");
}
export const dataStore = initSPARQLDataStoreFromConfig(
  config,
  worker(config.sparqlEndpoint),
  getSPARQLFlavour(config.sparqlEndpoint),
);
