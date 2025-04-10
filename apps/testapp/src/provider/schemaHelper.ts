
import { JSONSchema7 } from "json-schema";
import { schema } from "../schema";
import { createUISchemata, createStubSchema } from "@graviola/semantic-json-form";
import { BASE_IRI, entities } from "./config";

const labels: Record<string, string> = {
  Category: "Kategorie",
  Item: "Artikel",
};

const additionalOptions: Record<string, any> = {
  Category: {
    dropdown: true,
  },
};

const definitionToTypeIRI = (definitionName: string) => `${BASE_IRI}${definitionName}`;

export const uiSchemata = createUISchemata(schema as JSONSchema7, {
  typeNameLabelMap: labels,
  typeNameUiSchemaOptionsMap: additionalOptions,
  definitionToTypeIRI,
});


export const makeStubSchema = (schema: JSONSchema7) => createStubSchema(schema, {
  entityBaseIRI: entities,
  definitionToTypeIRI,
});