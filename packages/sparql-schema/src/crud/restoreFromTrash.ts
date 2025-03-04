import { SPARQLCRUDOptions } from "@graviola/edb-core-types";
import { JSONSchema7 } from "json-schema";

import { makeSPARQLRestoreFromTrashQuery } from "@/crud/makeSPARQLRestoreFromTrashQuery";

export const restoreFromTrash = async (
  entityIRI: string | string[],
  typeIRI: string | undefined,
  schema: JSONSchema7,
  updateFetch: (query: string) => Promise<any>,
  options: SPARQLCRUDOptions,
) => {
  const renameClassQuery = makeSPARQLRestoreFromTrashQuery(
    entityIRI,
    typeIRI,
    schema,
    options,
  );

  return await updateFetch(renameClassQuery);
};
