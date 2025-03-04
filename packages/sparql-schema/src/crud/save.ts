import {
  NamedAndTypedEntity,
  SPARQLCRUDOptions,
} from "@graviola/edb-core-types";
import { dataset2NTriples, jsonld2DataSet } from "@graviola/jsonld-utils";
import { INSERT } from "@tpluscode/sparql-builder";
import { JSONSchema7 } from "json-schema";

import { makeSPARQLDeleteQuery } from "@/crud/makeSPARQLDeleteQuery";
import { withDefaultPrefix } from "@/crud/makeSPARQLWherePart";

type SaveOptions = SPARQLCRUDOptions & {
  skipRemove?: boolean;
};
export const save = async (
  dataToBeSaved: NamedAndTypedEntity,
  schema: JSONSchema7,
  updateFetch: (query: string) => Promise<any>,
  options: SaveOptions,
) => {
  const { skipRemove, queryBuildOptions, defaultPrefix } = options;
  const entityIRI = dataToBeSaved["@id"];
  const typeIRI = dataToBeSaved["@type"];
  const ds = await jsonld2DataSet(dataToBeSaved);
  const ntriples = await dataset2NTriples(ds);
  const insertQuery = withDefaultPrefix(
    defaultPrefix,
    INSERT.DATA` ${ntriples} `.build(queryBuildOptions),
  );

  if (skipRemove) {
    return await updateFetch(insertQuery);
  }

  const deleteQuery = makeSPARQLDeleteQuery(
    entityIRI,
    typeIRI,
    schema,
    options,
  );
  try {
    await updateFetch(deleteQuery);
  } catch (e) {
    throw new Error("unable to delete the entry - DELETE query failed", {
      cause: e,
    });
  }
  return await updateFetch(insertQuery);
};
