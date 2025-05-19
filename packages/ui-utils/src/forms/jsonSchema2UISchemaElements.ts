import { JsonSchema, ControlElement } from "@jsonforms/core";

/**
 * Convert a JSON Schema to a list of UI Schema elements
 * this is very usefull if you either do not have a specific UI Schema
 * or if you want to generate a UI Schema from a JSON Schema and "fill the gaps"
 * of elements that are not defined in the UI Schema
 *
 * you can optionally provide a subpath to the schema to generate the UI Schema elements for a specific part of the schema
 *
 * normally the scope will be "#/properties/exampleProperty" but a subpath can make it deeper
 * like "#/properties/exampleDict/subProperty" by passing subpath "exampleDict/"
 *
 * @param jsonschema
 * @param subpath
 */
export const jsonSchema2UISchemaElements: (
  jsonschema: JsonSchema,
  subpath?: string,
) => ControlElement[] = (jsonschema: JsonSchema, subpath) => {
  const uiSchemaElements: ControlElement[] = Object.keys(
    jsonschema.properties || {},
  ).map((k) => ({
    type: "Control",
    scope: `#/properties/${subpath || ""}${k}`,
  }));
  return uiSchemaElements;
};
