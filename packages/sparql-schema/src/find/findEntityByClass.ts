import { Entity, PrimaryField, QueryOptions } from "@graviola/edb-core-types";
import df from "@rdfjs/data-model";
import { SELECT } from "@tpluscode/sparql-builder";

export type FindEntityByClassOptions = QueryOptions & {
  primaryFields?: PrimaryField;
};

export const fixSparqlOrder: (sparqlQuery: string) => string = (
  sparqlQuery,
) => {
  const regex = /(ORDER BY\s+[^ ]+)(\s*)GROUP BY\s+\(([^\)]+)\)/gm;
  return sparqlQuery.replace(regex, "GROUP BY $3 $2\n$1");
};

const toPredicate = (field: string) => {
  //only allow alphanumeric, dashes and underscores
  const cleanField = field.replace(/[^a-zA-Z0-9_-]/g, "");
  return cleanField.startsWith(":") ? cleanField : `:${cleanField}`;
};

export type FindEntityByClassFn = (
  searchString: string | null,
  typeIRI: string,
  doQuery: (query: string) => Promise<any>,
  options: FindEntityByClassOptions,
  limit?: number,
) => Promise<Entity[]>;

export const findEntityByClass: FindEntityByClassFn = async (
  searchString: string | null,
  typeIRI: string,
  doQuery: (query: string) => Promise<any>,
  options,
  limit?: number,
) => {
  const { queryBuildOptions, defaultPrefix, primaryFields } = options;
  const { label, description, image } = primaryFields || {};
  const labelPredicate = label ? toPredicate(label) : ":name";
  const titlePredicate = ":title";
  const descriptionPredicate = description
    ? toPredicate(description)
    : ":description";
  const imagePredicate = image ? toPredicate(image) : ":image";
  const subjectV = df.variable("subject"),
    nameV = df.variable("name"),
    titleV = df.variable("title"),
    descriptionV = df.variable("description"),
    imageV = df.variable("image"),
    concatenatedV = df.variable("concatenated"),
    safeNameV = df.variable("safeName"),
    safeTitleV = df.variable("safeTitle"),
    safeDescriptionV = df.variable("safeDescription"),
    safeImageV = df.variable("safeImage"),
    oneOfLabelOrDesc = df.variable("oneOfTitle"),
    firstOneOfTitleV = df.variable("firstOneOfTitle"),
    firstImageV = df.variable("firstImage"),
    firstDescriptionV = df.variable("firstDescription");

  let query =
    searchString && searchString.length > 0
      ? SELECT.DISTINCT` ${subjectV} (SAMPLE(${oneOfLabelOrDesc}) AS ${firstOneOfTitleV}) (SAMPLE(${imageV}) AS ${firstImageV}) (SAMPLE(${descriptionV}) AS ${firstDescriptionV})`
          .WHERE`
          ${subjectV} a <${typeIRI}> .
            OPTIONAL {${subjectV} ${labelPredicate} ${nameV} .}
            OPTIONAL {${subjectV} ${titlePredicate} ${titleV} .}
            OPTIONAL {${subjectV} ${descriptionPredicate} ${descriptionV} .}
            OPTIONAL {${subjectV} ${imagePredicate} ${imageV} .}

            BIND (COALESCE(${nameV}, "") AS ${safeNameV})
            BIND (COALESCE(${titleV}, "") AS ${safeTitleV})
            BIND (COALESCE(${descriptionV}, "") AS ${safeDescriptionV})
            BIND (COALESCE(${imageV}, "") AS ${safeImageV})
            BIND (COALESCE(${nameV}, ${titleV}, ${descriptionV}, "") AS ${oneOfLabelOrDesc})

            BIND (CONCAT(${safeNameV}, " ", ${safeTitleV}, " ", ${safeDescriptionV}) AS ${concatenatedV})
            FILTER(contains(lcase(${concatenatedV}), lcase("${searchString}") )) .

            FILTER isIRI(${subjectV})
            FILTER (strlen(${oneOfLabelOrDesc}) > 0)
        `
      : SELECT.DISTINCT` ${subjectV} (SAMPLE(${oneOfLabelOrDesc}) AS ${firstOneOfTitleV}) (SAMPLE(${imageV}) AS ${firstImageV}) (SAMPLE(${descriptionV}) AS ${firstDescriptionV})`
          .WHERE`
          ${subjectV} a <${typeIRI}> .
            OPTIONAL {${subjectV} ${labelPredicate} ${nameV} .}
            OPTIONAL {${subjectV} ${titlePredicate} ${titleV} .}
            OPTIONAL {${subjectV} ${descriptionPredicate} ${descriptionV} .}
            BIND (COALESCE(${nameV}, ${titleV}, ${descriptionV}, "") AS ${oneOfLabelOrDesc})
            FILTER isIRI(${subjectV})
            FILTER (strlen(${oneOfLabelOrDesc}) > 0)
        `;
  if (typeof limit === "number") query = query.LIMIT(limit);
  query = query.GROUP().BY(subjectV).ORDER().BY(firstOneOfTitleV);
  const fixedQuery = fixSparqlOrder(query.build(queryBuildOptions));
  const queryString = defaultPrefix
    ? `PREFIX : <${defaultPrefix}> \n\n ${fixedQuery}`
    : fixedQuery;
  try {
    const bindings = await doQuery(queryString);
    if (!bindings) return [];
    return bindings
      .map((binding: any) => ({
        entityIRI: binding[subjectV.value]?.value,
        typeIRI: typeIRI,
        name: binding[safeNameV.value]?.value,
        value: binding[subjectV.value]?.value,
        label: binding[firstOneOfTitleV.value]?.value,
        description: binding[firstDescriptionV.value]?.value,
        image: binding[firstImageV.value]?.value,
      }))
      .filter((entity: Entity) => entity.entityIRI);
  } catch (e) {
    console.error("Error finding entity by class", e);
    return [];
  }
};
