import { AvailableFlatMappings } from "@graviola/edb-data-mapping";
import { matchBasedSpreadsheetMappings_NewYork } from "./spreadSheetMappings_NewYork";

export const availableFlatMappings: AvailableFlatMappings = {
  NewYork: {
    typeName: "Exhibition",
    mapping: matchBasedSpreadsheetMappings_NewYork,
  },
} as const;
