import { makeSPARQLDeleteQuery } from "@/crud/makeSPARQLDeleteQuery";
import { JSONSchema7 } from "json-schema";
import { SPARQLCRUDOptions } from "@graviola/edb-core-types";

export const remove = async (
  entityIRI: string,
  typeIRI: string | undefined,
  schema: JSONSchema7,
  deleteFetch: (query: string) => Promise<any>,
  options: SPARQLCRUDOptions,
) => {
  const deleteQuery = makeSPARQLDeleteQuery(
    entityIRI,
    typeIRI,
    schema,
    options,
  );
  return await deleteFetch(deleteQuery);
};
