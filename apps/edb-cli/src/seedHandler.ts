import { SemanticSeedHandler } from "@graviola/edb-cli-creator";
import { processEachDocumentFromFile } from "@graviola/edb-file-import";
import config from "@slub/exhibition-sparql-config";
import { typeNameToTypeIRI } from "./dataStore";

export const seedHandler: SemanticSeedHandler = async ({
  file,
  schema,
  onDocument,
}) => {
  return processEachDocumentFromFile(file, schema, onDocument, {
    jsonldContext: config.defaultJsonldContext,
    defaultPrefix: config.defaultPrefix,
    walkerOptions: config.walkerOptions,
    typeNameToTypeIRI: typeNameToTypeIRI,
  });
};
