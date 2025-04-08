import {
  createNewIRI,
  defaultJsonldContext,
  defaultPrefix,
  defaultQueryBuilderOptions,
  sladb,
} from "./formConfigs";
import { BASE_IRI } from "./paths";
import {
  authorityAccess,
  availableAuthorityMappings,
  makeStubSchema,
  schema,
} from "@slub/exhibition-schema";
import { JSONSchema7 } from "json-schema";
import { makeDefaultUiSchemaForAllDefinitions } from "./makeDefaultUiSchemaForAllDefinitions";
import { rendererRegistry } from "./rendererRegistry";
import { materialCells } from "@jsonforms/material-renderers";
import { primaryFieldsRegistry } from "./primaryFieldsRegistry";
import { uischemata } from "./uischemata";
import { DeclarativeMapping } from "@graviola/edb-data-mapping";
import { GlobalAppConfig } from "@graviola/semantic-jsonform-types";

const someNameToTypeIRI = (name: string) => sladb(name).value;
const someIRIToTypeName = (iri: string) =>
  iri?.substring(BASE_IRI.length, iri.length);
export const exhibitionConfig: GlobalAppConfig<DeclarativeMapping> = {
  queryBuildOptions: defaultQueryBuilderOptions,
  typeNameToTypeIRI: someNameToTypeIRI,
  propertyNameToIRI: someNameToTypeIRI,
  typeIRIToTypeName: someIRIToTypeName,
  propertyIRIToPropertyName: someIRIToTypeName,
  createEntityIRI: createNewIRI,
  jsonLDConfig: {
    defaultPrefix: defaultPrefix,
    jsonldContext: defaultJsonldContext,
    allowUnsafeSourceIRIs: false,
  },
  normDataMapping: availableAuthorityMappings,
  authorityAccess: authorityAccess,
  schema: schema as JSONSchema7,
  makeStubSchema: makeStubSchema,
  uiSchemaDefaultRegistry: makeDefaultUiSchemaForAllDefinitions(
    schema as JSONSchema7,
  ),
  rendererRegistry: rendererRegistry,
  cellRendererRegistry: materialCells,
  primaryFieldRendererRegistry: (typeIRI: string) =>
    primaryFieldsRegistry(typeIRI, someIRIToTypeName),
  uischemata: uischemata,
};
