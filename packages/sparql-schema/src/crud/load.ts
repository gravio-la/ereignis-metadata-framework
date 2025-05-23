import { SPARQLCRUDOptions, WalkerOptions } from "@graviola/edb-core-types";
import { traverseGraphExtractBySchema } from "@graviola/edb-graph-traversal";
import { Dataset, DatasetCore } from "@rdfjs/types";
import { JSONSchema7 } from "json-schema";
import { JsonLdContext } from "jsonld-context-parser";

import { makeSPARQLConstructQuery } from "@/crud/makeSPARQLConstructQuery";

type LoadOptions = SPARQLCRUDOptions & {
  walkerOptions?: Partial<WalkerOptions>;
  jsonldContext?: JsonLdContext;
};

export type LoadResult = {
  subjects: string[];
  document: any;
};
export const load = async (
  entityIRI: string,
  typeIRI: string | undefined,
  schema: JSONSchema7,
  constructFetch: (query: string) => Promise<DatasetCore>,
  options: LoadOptions,
): Promise<LoadResult> => {
  const { walkerOptions, jsonldContext, ...crudOptions } = options;
  const constructQuery = makeSPARQLConstructQuery(
    entityIRI,
    typeIRI,
    schema,
    crudOptions,
  );
  const ds = await constructFetch(constructQuery);
  const subjects: Set<string> = new Set();
  // @ts-ignore
  for (const quad of ds) {
    if (quad.subject.termType === "NamedNode") {
      subjects.add(quad.subject.value);
    }
  }
  const document = traverseGraphExtractBySchema(
    options.defaultPrefix,
    entityIRI,
    ds as Dataset,
    schema,
    walkerOptions,
  );
  return {
    subjects: Array.from(subjects),
    document,
  };
};
