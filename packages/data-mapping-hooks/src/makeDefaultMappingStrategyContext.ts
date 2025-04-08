import type {
  IRIToStringFn,
  NormDataMappings,
  PrimaryFieldDeclaration,
} from "@graviola/edb-core-types";
import {
  type AuthorityConfiguration,
  createLogger,
  type DeclarativeMapping,
  makeCreateDeeperContextFn,
  type StrategyContext,
} from "@graviola/edb-data-mapping";
import type { AbstractDatastore } from "@graviola/edb-global-types";



/**
 * Creating a context for the mapping requires a lot of boilerplate code. Thus, this function is provided
 * to facilitate the creation of the context.
 *
 * the strategy context is a collection of functions and values that are used by the mapping strategies.
 *
 * @param dataStore the data store to use
 * @param createEntityIRI a function that creates a new IRI for an entity of a given type
 * @param typeIRItoTypeName a function that maps typeIRIs to type names
 * @param primaryFields the primary fields for all types that are used in the mapping
 * @param declarativeMappings the mappings that are used to map norm data to the data store
 * @param authorityAccess the authority access configuration
 * @param disableLogging whether to disable logging
 */
export const makeDefaultMappingStrategyContext: (
  dataStore: AbstractDatastore,
  createEntityIRI: (typeIRI: string) => string,
  typeIRIToTypeName: IRIToStringFn,
  primaryFields: PrimaryFieldDeclaration,
  normDataMappings?: NormDataMappings<DeclarativeMapping>,
  authorityAccess?: Record<string, AuthorityConfiguration>,
  disableLogging?: boolean,
) => StrategyContext = (
  dataStore,
  createEntityIRI,
  typeIRItoTypeName,
  primaryFields,
  normDataMappings,
  authorityAccess,
  disableLogging = false,
) => ({
  getPrimaryIRIBySecondaryIRI: async (
    secondaryIRI: string,
    authorityIRI: string,
    typeIRI?: string | undefined,
  ) => {
    // @ts-ignore
    const ids = await dataStore.findDocumentsByAuthorityIRI(
      secondaryIRI,
      authorityIRI,
      typeIRI,
    );

    if (ids.length > 0) {
      console.warn("found more then one entity");
    }
    return ids[0] || null;
  },
  searchEntityByLabel: async (
    label: string,
    typeIRI: string,
  ): Promise<string> => {
    // @ts-ignore
    const ids = await dataStore.findDocumentsByLabel(label, typeIRI);
    if (ids.length > 0) {
      console.warn("found more then one entity");
    }
    return ids[0] || null;
  },
  authorityAccess: authorityAccess,
  authorityIRI: "http://d-nb.info/gnd",
  newIRI: createEntityIRI,
  typeIRItoTypeName: typeIRItoTypeName,
  primaryFields: primaryFields,
  normDataMappings,
  path: [],
  logger: createLogger([], disableLogging),
  createDeeperContext: makeCreateDeeperContextFn(disableLogging),
});
