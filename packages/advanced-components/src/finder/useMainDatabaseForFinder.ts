import { useAdbContext, useCrudProvider } from "@graviola/edb-state-hooks";
import { useMemo } from "react";

import { KBMainDatabase } from "./KBMainDatabase";

export const useMainDatabaseForFinder = () => {
  const {
    jsonLDConfig: { defaultPrefix },
    typeIRIToTypeName,
  } = useAdbContext();
  const { dataStore } = useCrudProvider();
  return useMemo(
    () => KBMainDatabase(dataStore, defaultPrefix, typeIRIToTypeName),
    [dataStore, defaultPrefix, typeIRIToTypeName],
  );
};
