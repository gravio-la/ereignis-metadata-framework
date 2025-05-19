import { StringToIRIFn } from "@graviola/edb-core-types";
import { prepareStubbedSchema, type GeneratePropertiesFunction } from "@graviola/json-schema-utils";
import type { JSONSchema7 } from "json-schema";

type CreateStubSchemaOptions = {
  entityBaseIRI: string;
  definitionToTypeIRI: StringToIRIFn;
};

export const createStubSchema = (schema: JSONSchema7, options: CreateStubSchemaOptions): JSONSchema7 => {

  const { entityBaseIRI, definitionToTypeIRI } = options;
  const genJSONLDSemanticProperties: GeneratePropertiesFunction =
    (modelName: string) => ({
      "@type": {
        const: definitionToTypeIRI(modelName.replace(/Stub$/, "")),
        type: "string",
      },
      "@id": {
        title: entityBaseIRI,
        type: "string",
      },
    });

  return prepareStubbedSchema(schema,
    genJSONLDSemanticProperties,
  );
};
