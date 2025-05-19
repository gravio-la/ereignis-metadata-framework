import { IRIToStringFn, SparqlBuildOptions } from "@graviola/edb-core-types";
import { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import { materialCells } from "@jsonforms/material-renderers";
import namespace from "@rdfjs/namespace";
import {
  makeStubSchema,
  primaryFieldExtracts,
  primaryFields,
  schema,
} from "@slub/kulinarik-schema";
import { JSONSchema7 } from "json-schema";
import { v4 as uuidv4 } from "uuid";

import {
  primaryTextFieldControlTester,
  PrimaryTextFieldRenderer,
} from "../renderer";
import { makeDefaultUiSchemaForAllDefinitions } from "./makeDefaultUiSchemaForAllDefinitions";
import { rendererRegistry } from "./rendererRegistry";

const BASE_IRI = "http://ontologies.slub-dresden.de/kulinarik#";
const sladb = namespace(BASE_IRI);
const slent = namespace("http://ontologies.slub-dresden.de/kulinarik/entity/");

export const typeIRItoTypeName = (iri: string) => {
  return iri?.substring(BASE_IRI.length, iri.length);
};

const defaultPrefix = sladb[""].value;
const defaultJsonldContext = {
  "@vocab": defaultPrefix,
  xs: "http://www.w3.org/2001/XMLSchema#",
  image: {
    "@type": "xs:anyURI",
  },
};

const defaultQueryBuilderOptions: SparqlBuildOptions = {
  prefixes: { [""]: sladb[""].value, slent: slent[""].value },
  propertyToIRI: (property: string) => {
    return sladb[property].value;
  },
  typeIRItoTypeName: typeIRItoTypeName,
  primaryFields: primaryFields,
  primaryFieldExtracts: primaryFieldExtracts,
  sparqlFlavour: "oxigraph",
};

const createNewIRI = () => slent(uuidv4()).value;
const primaryFieldsRegistry: (
  typeIRI: string,
  typeIRItoTypeName: IRIToStringFn,
) => JsonFormsRendererRegistryEntry[] = (typeIRI, typeIRIToTypeName) =>
  primaryFields[typeIRIToTypeName(typeIRI)]?.label
    ? [
        {
          tester: primaryTextFieldControlTester(typeIRIToTypeName(typeIRI)),
          renderer: PrimaryTextFieldRenderer,
        },
      ]
    : [];
const someNameToTypeIRI = (name: string) => sladb(name).value;
const someIRIToTypeName = (iri: string) =>
  iri?.substring(BASE_IRI.length, iri.length);
export const kulinarikAppConfig = {
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
  normDataMapping: {
    gnd: {
      mapping: [],
      typeToTypeMap: {},
    },
  },
  schema: schema as JSONSchema7,
  makeStubSchema: makeStubSchema,
  uiSchemaDefaultRegistry: makeDefaultUiSchemaForAllDefinitions(
    schema as JSONSchema7,
  ),
  rendererRegistry: rendererRegistry,
  cellRendererRegistry: materialCells,
  uischemata: undefined,
};
