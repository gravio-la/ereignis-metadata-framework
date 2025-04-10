import { and, isObjectArray, rankWith, schemaMatches } from "@jsonforms/core";
import type { JSONSchema7 } from "json-schema";

export const materialArrayOfLinkedItemTester = rankWith(
  5,
  and(
    isObjectArray,
    schemaMatches((schema) => {
      if (
        !(
          schema.type === "array" &&
          typeof schema.items === "object" &&
          (schema.items as JSONSchema7).properties
        )
      ) {
        return Boolean((schema.items as JSONSchema7).$ref);
      }
      const props = (schema.items as JSONSchema7).properties;
      return Boolean(props["@id"]);
    }),
  ),
)