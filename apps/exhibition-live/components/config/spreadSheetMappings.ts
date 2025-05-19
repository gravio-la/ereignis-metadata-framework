import {
  DeclarativeFlatMappings,
  DeclarativeMatchBasedFlatMappings,
} from "@graviola/edb-data-mapping";

import { OwnColumnDesc } from "../google/types";
import { spreadSheetMapping_Hamburg } from "./spreadSheetMapping_Hamburg";
import {
  matchBasedSpreadsheetMappings_NewYork,
  spreadSheetMappings_NewYork,
} from "./spreadSheetMappings_NewYork";

export type ConcreteSpreadSheetMapping = {
  raw?: DeclarativeMatchBasedFlatMappings;
  fieldMapping: (fields: OwnColumnDesc[]) => DeclarativeFlatMappings;
};

export type SpreadSheetMappingCollection = {
  [key: string]: ConcreteSpreadSheetMapping;
};
export const spreadSheetMappings: SpreadSheetMappingCollection = {
  "[Konvolut Hamburg]": {
    fieldMapping: spreadSheetMapping_Hamburg,
  },
  "[Konvolut K1 New York]": {
    raw: matchBasedSpreadsheetMappings_NewYork,
    fieldMapping: spreadSheetMappings_NewYork,
  },
} as const;
