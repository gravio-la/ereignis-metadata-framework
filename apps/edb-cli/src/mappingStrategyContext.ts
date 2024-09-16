import {
  IRIToStringFn,
  NormDataMapping,
  NormDataMappings,
  Prefixes,
  PrimaryFieldDeclaration,
  QueryBuilderOptions,
} from "@slub/edb-core-types";
import { DeclarativeMapping, StrategyContext } from "@slub/edb-data-mapping";
import {
  findEntityByAuthorityIRI,
  searchEntityByLabel,
} from "@slub/sparql-schema";
import { findEntityWithinLobidByIRI } from "@slub/edb-authorities";
import config, { slent } from "@slub/exhibition-sparql-config";
import { v4 as uuidv4 } from "uuid";
import {
  availableAuthorityMappings,
  primaryFields,
} from "@slub/exhibition-schema";
import {
  createLogger,
  makeCreateDeeperContextFn,
} from "@slub/edb-data-mapping";
import { dataStore, crudFunctions } from "./dataStore";
import { getEntityFromWikidataByIRI } from "@slub/edb-ui-utils";
import { authorityAccess } from "./auhtorityAccess";

export const makeMappingStrategyContext: (
  doQuery: (query: string) => Promise<any>,
  queryBuilderOptions: QueryBuilderOptions,
  createEntityIRI: (typeIRI: string) => string,
  typeIRIToTypeName: IRIToStringFn,
  primaryFields: PrimaryFieldDeclaration,
  disableLogging?: boolean,
) => StrategyContext = (
  doQuery,
  queryBuilderOptions,
  createEntityIRI,
  typeIRItoTypeName,
  primaryFields,
  disableLogging = false,
) => ({
  getPrimaryIRIBySecondaryIRI: async (
    secondaryIRI: string,
    authorityIRI: string,
    typeIRI?: string | undefined,
  ) => {
    // @ts-ignore
    const ids = await findEntityByAuthorityIRI(
      secondaryIRI,
      typeIRI,
      doQuery,
      100,
      queryBuilderOptions,
    );
    if (ids.length > 1) {
      console.warn(
        `found more than one entity (${ids.length}), will use the first`,
      );
    }
    return ids[0] || null;
  },
  searchEntityByLabel: async (
    label: string,
    typeIRI: string,
  ): Promise<string> => {
    // @ts-ignore
    const ids = await searchEntityByLabel(label, typeIRI, doQuery, undefined, {
      ...queryBuilderOptions,
      typeIRItoTypeName,
      primaryFields,
    });
    if (ids.length > 1) {
      console.warn(
        `found more than one entity ( ${ids.length} ), will use the first `,
      );
    }
    return ids[0] || null;
  },
  authorityAccess,
  authorityIRI: "http://d-nb.info/gnd",
  newIRI: createEntityIRI,
  typeIRItoTypeName: typeIRItoTypeName,
  primaryFields: primaryFields,
  normDataMappings: availableAuthorityMappings,
  path: [],
  logger: createLogger([], disableLogging),
  createDeeperContext: makeCreateDeeperContextFn(disableLogging),
});

const { defaultPrefix, defaultQueryBuilderOptions } = config;

export const createNewIRI = () => slent(uuidv4()).value;
export const mappingStrategyContext = {
  ...makeMappingStrategyContext(
    crudFunctions.selectFetch,
    {
      prefixes: defaultQueryBuilderOptions.prefixes as Prefixes,
      defaultPrefix,
    },
    createNewIRI,
    dataStore.typeIRItoTypeName,
    primaryFields,
    true,
  ),
  getPrimaryIRIBySecondaryIRI: async (
    secondaryIRI: string,
    authorityIRI: string,
    typeIRI: string,
  ) => {
    const typeName = dataStore.typeIRItoTypeName(typeIRI);
    if (!dataStore.findDocumentsByAuthorityIRI) return;
    const doc = await dataStore
      .findDocumentsByAuthorityIRI(typeName, secondaryIRI, authorityIRI)
      .then((res) => res[0] as string);
    return doc;
  },

  searchEntityByLabel: async (
    label: string,
    typeIRI: string,
  ): Promise<string> => {
    const typeName = dataStore.typeIRItoTypeName(typeIRI);
    if (!dataStore.findDocumentsByLabel)
      return Promise.reject("datastore does not support find");
    const doc = await dataStore
      .findDocumentsByLabel(typeName, label)
      .then((res) => res[0] as string);
    return doc;
  },
  onNewDocument: async (document: any) => {
    const typeName = dataStore.typeIRItoTypeName(document["@type"]);
    await dataStore.upsertDocument(typeName, document["@id"], document);
  },
  logger: createLogger([], true),
};
