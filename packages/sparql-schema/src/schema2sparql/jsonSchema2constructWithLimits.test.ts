import { describe, expect, test } from "@jest/globals";
import { CONSTRUCT } from "@tpluscode/sparql-builder";
import { JSONSchema7 } from "json-schema";

import { jsonSchema2constructWithLimits } from "./jsonSchema2constructWithLimits";
import { Prefixes } from "@slub/edb-core-types";

const BASE_IRI = "http://ontologies.slub-dresden.de/exhibition#";
export const testPrefixes: Prefixes = {
  sladb: "http://ontologies.slub-dresden.de/exhibition#",
  slent: "http://ontologies.slub-dresden.de/exhibition/entity#",
  slsrc: "http://ontologies.slub-dresden.de/source#",
  slmeta: "http://ontologies.slub-dresden.de/meta#",
  slperson: "http://ontologies.slub-dresden.de/person#",
};

const schema: JSONSchema7 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://example.com/person.schema.json",
  title: "Person",
  description: "A human being",
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string",
    },
    friends: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
      },
    },
    hobbies: {
      type: "array",
      items: { type: "string" },
    },
  },
};

const subject = "http://www.example.com/test";

const buildConstructQuery = (subjectURI: string, schema: JSONSchema7) => {
  const { construct, whereRequired, whereOptionals, countQueries } = jsonSchema2constructWithLimits(
    subjectURI,
    schema,
    [],
    [],
    4,
    5
  );
  return CONSTRUCT`${construct}`.WHERE`${whereRequired}\n${whereOptionals}\n${countQueries}`;
};

describe("jsonSchema2constructWithLimits", () => {
  test("can build construct query with limits from schema", () => {
    const constructQuery = buildConstructQuery(subject, schema)
      .build({
        base: BASE_IRI,
        prefixes: {
          ...testPrefixes,
        },
      })
      .toString();
    
    console.log(constructQuery);
    
    expect(constructQuery).toMatch(/CONSTRUCT {.*/);
    expect(constructQuery).toMatch(/SELECT.*LIMIT 5/);
    expect(constructQuery).toMatch(/COUNT\(\?friends_\d+\) AS \?friends_\d+_count/);
    expect(constructQuery).toMatch(/COUNT\(\?hobbies_\d+\) AS \?hobbies_\d+_count/);
  });
});
