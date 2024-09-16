import { MapFromAuthorityHandler } from "@slub/edb-cli-creator";
import { NormDataMapping } from "@slub/edb-core-types";
import { mapByConfig } from "@slub/edb-data-mapping";
import { availableAuthorityMappings } from "@slub/exhibition-schema";
import { dataStore } from "src/dataStore";
import { mappingStrategyContext } from "src/mappingStrategyContext";

const getMappingConfig = (
  normDataMapping: Record<string, NormDataMapping>,
  authorityIRI: string,
  typeName: string,
) => {
  const declarativeMapping = normDataMapping[authorityIRI];
  if (!declarativeMapping) {
    throw new Error(`no mapping declaration config for ${authorityIRI}`);
  }
  const mappingConfig = declarativeMapping.mapping[typeName];
  if (!mappingConfig) {
    throw new Error(`no mapping config for ${typeName}`);
  }

  return mappingConfig;
};
export const mapFromAuthority: MapFromAuthorityHandler = async (
  id: string | undefined,
  classIRI: string,
  entryData: any,
  authorityIRI: string,
  limit: number = 1,
) => {
  const mappingConfig = getMappingConfig(
    availableAuthorityMappings,
    authorityIRI,
    dataStore.typeIRItoTypeName(classIRI),
  );
  const dataFromAuthority = await mapByConfig(
    entryData.allProps,
    {},
    mappingConfig,
    /* @ts-ignore */
    mappingStrategyContext,
  );
  return dataFromAuthority;
};
