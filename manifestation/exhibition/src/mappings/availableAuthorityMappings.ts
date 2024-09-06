import { wikidataTypeMap } from "./wikidataMappings";
import { declarativeMappings, lobidTypemap } from "./lobidMappings";
import { NormDataMappings } from "@slub/edb-core-types";

export const availableAuthorityMappings: NormDataMappings = {
  "http://www.wikidata.org": {
    label: "Wikidata",
    sameAsTypeMap: wikidataTypeMap,
    mapping: {},
  },
  "http://d-nb.info/gnd": {
    label: "GND",
    sameAsTypeMap: lobidTypemap,
    mapping: declarativeMappings,
  },
} as const;
