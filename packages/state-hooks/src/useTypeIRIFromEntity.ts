import { useQuery } from "@tanstack/react-query";
import { useDataStore } from "./useDataStore";
import { useMemo } from "react";

export const useTypeIRIFromEntity = (
  entityIRI: string,
  typeIRI?: string,
  disableQuery?: boolean,
) => {
  const { dataStore, ready } = useDataStore();
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
