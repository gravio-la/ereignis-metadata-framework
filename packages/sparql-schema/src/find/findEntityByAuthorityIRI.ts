import df from "@rdfjs/data-model";
import { SELECT } from "@tpluscode/sparql-builder";
import { QueryBuilderOptions } from "@graviola/edb-core-types";
import { filterUndefOrNull } from "@graviola/edb-core-utils";
import { Term } from "@rdfjs/types";

type Bindings = Record<string, Term>[];

export type FindEntityByAuthorityIRIFn = (
  authorityIRI: string,
  typeIRI: string | undefined,
  doQuery: (query: string) => Promise<Bindings>,
  limit?: number,
  options?: QueryBuilderOptions,
) => Promise<string[]>;

/**
 * will build and execute a query, that finds an entity by its authority IRI - the authority IRI is meant to be an identifier withn a
 * secondary knowledge base, and the function will return all entities that have an authority IRI that matches the given IRI
 * or an empty array if no entities have been found
 *
 * @param authorityIRI
 * @param typeIRI
 * @param doQuery
 * @param limit
 * @param options
 * @returns
 */
export const findEntityByAuthorityIRI: FindEntityByAuthorityIRIFn = async (
  authorityIRI,
  typeIRI,
  doQuery,
  limit = 10,
  options,
) => {
  const { prefixes, defaultPrefix } = options;
  const subjectV = df.variable("subject");
  let query = (
    typeIRI
      ? SELECT.DISTINCT` ${subjectV}`.WHERE`
    ${subjectV} :idAuthority/:id <${authorityIRI}> .
    ${subjectV} a <${typeIRI}> .
  `
      : SELECT.DISTINCT` ${subjectV}`.WHERE`
    ${subjectV} :idAuthority/:id <${authorityIRI}> .
  `
  )
    .LIMIT(limit)
    .build({ prefixes });

  query = `PREFIX : <${defaultPrefix}>
  ${query}`;
  const bindings = await doQuery(query);
  return filterUndefOrNull(
    bindings.map((binding) =>
      binding.subject?.termType === "NamedNode"
        ? binding.subject.value
        : undefined,
    ),
  );
};
