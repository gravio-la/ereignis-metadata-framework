import { mapByConfigFlat } from "@graviola/edb-data-mapping";
import type { DeclarativeFlatMappings } from "@graviola/edb-data-mapping";
import { CachedWorkSheet, CellTypeLike } from "./useCachedWorkSheet";
import { CRUDFunctions } from "@graviola/edb-core-types";
import { useAdbContext, useDataStore, useQuery } from "@graviola/edb-state-hooks";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { CircularProgress, List } from "@mui/material";
import { TypedListItem } from "@graviola/edb-advanced-components";
import { makeDefaultMappingStrategyContext } from "@graviola/data-mapping-hooks";

export type MappedItemProps<CellType extends CellTypeLike> = {
  path: string;
  index: number;
  spreadSheetMapping: DeclarativeFlatMappings;
  workSheet: CachedWorkSheet<CellType>;
  crudOptions?: CRUDFunctions;
};
export const MappedItem = <CellType extends CellTypeLike>({
  path,
  index,
  spreadSheetMapping,
  workSheet,
  crudOptions,
}: MappedItemProps<CellType>) => {
  const {
    queryBuildOptions: { prefixes, primaryFields },
    createEntityIRI,
    typeNameToTypeIRI,
    typeIRIToTypeName,
    normDataMapping,
    authorityAccess,
  } = useAdbContext();
  const { dataStore } = useDataStore();
  const mapData = useCallback(async () => {
    console.log("will map row", index);
    try {
      const targetData = {
        __index: index,
        "@id": createEntityIRI("Exhibition"),
        "@type": typeNameToTypeIRI("Exhibition"),
      };
      console.log("will map by config");
      const mappedData = await mapByConfigFlat(
        (col: number | string) => {
          const cell = workSheet.getCell(index, col as number);
          return cell.value as string;
        },
        targetData,
        spreadSheetMapping,
        makeDefaultMappingStrategyContext(
          dataStore,
          createEntityIRI,
          typeIRIToTypeName,
          primaryFields,
          normDataMapping,
          authorityAccess,
        ),
      );
      return mappedData;
    } catch (e) {
      console.warn("failed to map row", index, e);
    }
    return null;
  }, [
    workSheet,
    spreadSheetMapping,
    primaryFields,
    index,
    createEntityIRI,
    typeIRIToTypeName,
    normDataMapping,
    authorityAccess,
  ]);

  const { data, isLoading } = useQuery({
    queryKey: ["mappedData", path],
    queryFn: mapData,
    enabled: workSheet.loaded && spreadSheetMapping.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes,
  });
  const { t } = useTranslation();

  return isLoading ? (
    <>
      <CircularProgress title={t("calculate mapped data")} />
    </>
  ) : (
    <List>
      {data?.["@type"] && (
        <TypedListItem index={index} data={data} disableLoad={true} readonly />
      )}
    </List>
  );
};
