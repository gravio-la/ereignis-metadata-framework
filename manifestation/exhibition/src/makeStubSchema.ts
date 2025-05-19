import { JSONSchema7 } from "json-schema";
import {
  GeneratePropertiesFunction,
  prepareStubbedSchema,
  SchemaExpander,
} from "@graviola/json-schema-utils";

export const schemaExpander: SchemaExpander = {
  additionalProperties: {
    idAuthority: {
      title: "Normdatenbeziehung",
      type: "object",
      properties: {
        authority: {
          title: "Autorität",
          type: "string",
          format: "uri",
        },
        id: {
          title: "IRI",
          type: "string",
          format: "uri",
        },
      },
    },
  },
  options: {
    excludeType: ["InvolvedPerson", "InvolvedCorporation", "Workplace"],
    excludeSemanticPropertiesForType: [
      "InvolvedPerson",
      "InvolvedCorporation",
      "AuthorityEntry",
      "AuthorityEntry",
      "EventType",
      "ExhibitionCategory",
      "SeriesType",
      "Workplace",
    ],
  },
};
const makeGenSlubJSONLDSemanticProperties: (
  baseIRI: string,
  entitytBaseIRI: string,
) => GeneratePropertiesFunction =
  (baseIRI: string, entityBaseIRI: string) => (modelName: string) => ({
    "@type": {
      const: `${baseIRI}${modelName.replace(/Stub$/, "")}`,
      type: "string",
    },
    "@id": {
      type: "string",
    },
  });

const genSlubJSONLDSemanticProperties = makeGenSlubJSONLDSemanticProperties(
  "http://ontologies.slub-dresden.de/exhibition#",
  "http://ontologies.slub-dresden.de/exhibition/entity/",
);
const genSlubRequiredProperties = (_modelName: string) => {
  return ["@id"];
};
export const makeStubSchema: (schema: JSONSchema7) => JSONSchema7 = (
  schema,
) => {
  return prepareStubbedSchema(
    schema,
    genSlubJSONLDSemanticProperties,
    genSlubRequiredProperties,
    schemaExpander.options,
  );
};
