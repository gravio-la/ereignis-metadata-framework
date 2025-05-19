import { wikidataMappings, wikidataTypeMap } from "./wikidataMappings";
import { lobidMappings, lobidTypemap } from "./lobidMappings";
import { NormDataMappings } from "@graviola/edb-core-types";
import { DeclarativeMapping } from "@graviola/edb-data-mapping";

export const availableAuthorityMappings: NormDataMappings<DeclarativeMapping> =
  {
    "http://www.wikidata.org": {
      label: "Wikidata",
      sameAsTypeMap: wikidataTypeMap,
      mapping: wikidataMappings,
    },
    "http://d-nb.info/gnd": {
      label: "GND",
      sameAsTypeMap: lobidTypemap,
      mapping: lobidMappings,
    },
  } as const;
