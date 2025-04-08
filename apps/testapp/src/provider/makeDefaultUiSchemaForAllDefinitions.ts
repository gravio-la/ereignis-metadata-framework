import { JsonFormsUISchemaRegistryEntry } from "@jsonforms/core";

import { defs, GeneratePropertiesFunction, prepareStubbedSchema } from "@graviola/json-schema-utils";
import { JSONSchema7 } from "json-schema";
import { BASE_IRI, entities } from "./GraviolaProvider";

const labels: Record<string, string> = {
  Category: "Kategorie",
  Item: "Artikel",
};

const additionalOptions: Record<string, any> = {
  Category: {
    dropdown: true,
  },
};
export const createStubLayout = (
  defs: string,
  baseIRI: string,
  label?: string,
) => ({
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      label: labels[defs] || label || defs,
      options: {
        inline: true,
        context: {
          $ref: `#/definitions/${defs}`,
          typeIRI: `${baseIRI}${defs}`,
        },
        ...(additionalOptions[defs] || {}),
      },
      scope: "#/properties/@id",
    },
    {
      type: "Control",
      scope: "#/properties/@type",
    },
  ],
});

const createUiSchema: (
  key: string,
  baseIRI: string,
  label?: string,
) => JsonFormsUISchemaRegistryEntry = (key, baseIRI, label) => ({
  tester: (schema) => {
    const rank =
      schema.properties?.["@type"]?.const === `${baseIRI}${key}` ? 21 : -1;
    return rank;
  },
  uischema: createStubLayout(key, baseIRI, label),
});

export const makeDefaultUiSchemaForAllDefinitions: (
  schema: JSONSchema7,
) => JsonFormsUISchemaRegistryEntry[] = (schema) =>
  Object.keys(defs(schema as JSONSchema7)).map((key) =>
    createUiSchema(key, BASE_IRI),
  );


  const makeGenJSONLDSemanticProperties: (
    baseIRI: string,
    entitytBaseIRI: string,
  ) => GeneratePropertiesFunction =
    (baseIRI: string, entityBaseIRI: string) => (modelName: string) => ({
      "@type": {
        const: `${baseIRI}${modelName.replace(/Stub$/, "")}`,
        type: "string",
      },
      "@id": {
        title: entityBaseIRI,
        type: "string",
      },
    });
  
export const makeStubSchema: (
  schema: JSONSchema7,
) => JSONSchema7 = (schema) => {
  return prepareStubbedSchema(schema, makeGenJSONLDSemanticProperties(BASE_IRI, entities));
};