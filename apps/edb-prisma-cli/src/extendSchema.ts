import { JSONSchema7 } from "json-schema";
import {
  GeneratePropertiesFunction,
  extendDefinitionsWithProperties,
} from "@graviola/json-schema-utils";
const makeTypeAndIDProperties: GeneratePropertiesFunction = (
  _modelName: string,
) => ({
  type: {
    type: "string",
  },
  id: {
    type: "string",
  },
});

const genRequiredProperties = (_modelName: string) => {
  return ["type", "id"];
};

export const extendSchema = (schema: any): JSONSchema7 => {
  const excludeType = ["AuthorityEntry"];

  return extendDefinitionsWithProperties(
    schema,
    makeTypeAndIDProperties,
    genRequiredProperties,
    {
      excludeType,
    },
  );
};
