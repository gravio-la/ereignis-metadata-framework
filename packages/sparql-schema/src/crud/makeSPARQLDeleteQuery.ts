import { jsonSchema2construct } from "@/schema2sparql/jsonSchema2construct";
import {
  makeSPARQLWherePart,
  withDefaultPrefix,
} from "@/crud/makeSPARQLWherePart";
import { DELETE } from "@tpluscode/sparql-builder";
import { JSONSchema7 } from "json-schema";
import { SPARQLCRUDOptions } from "@graviola/edb-core-types";

export const makeSPARQLDeleteQuery = (
  entityIRI: string,
  typeIRI: string | undefined,
  schema: JSONSchema7,
  options: SPARQLCRUDOptions,
) => {
  const { defaultPrefix, queryBuildOptions } = options;
  const wherePart = typeIRI ? makeSPARQLWherePart(entityIRI, typeIRI) : "";
  const { construct, whereRequired, whereOptionals } = jsonSchema2construct(
    entityIRI,
    schema,
    ["@id"],
    ["@id", "@type"],
  );
  return withDefaultPrefix(
    defaultPrefix,
    DELETE` ${construct} `
      .WHERE`${wherePart} ${whereRequired}\n${whereOptionals}`.build(
      queryBuildOptions,
    ),
  );
};
