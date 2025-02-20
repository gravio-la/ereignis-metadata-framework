import { useQuery } from "@tanstack/react-query";
import { useGlobalCRUDOptions } from "./useGlobalCRUDOptions";
import { useAdbContext } from "./provider";
import { useDataStore } from "./useDataStore";
import { useMemo } from "react";

export const useTypeIRIFromEntity = (
  entityIRI: string,
  typeIRI?: string,
  disableQuery?: boolean,
) => {
  const { schema, typeNameToTypeIRI, queryBuildOptions, jsonLDConfig } =
    useAdbContext();
  const { crudOptions } = useGlobalCRUDOptions();
  const { dataStore, ready } = useDataStore({
    schema,
    crudOptionsPartial: crudOptions,
    typeNameToTypeIRI,
    queryBuildOptions,
  });
  const { data: typeIRIs } = useQuery(
    ["classes", entityIRI],
    async () => {
      return await dataStore.getClasses(entityIRI);
    },
    {
      enabled: Boolean(!typeIRI && entityIRI && ready && !disableQuery),
    },
  );
  return useMemo(() => typeIRI || typeIRIs?.[0], [typeIRI, typeIRIs]);
};
