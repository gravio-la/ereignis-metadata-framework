---
to: manifestation/<%= name %>/src/createPrismaSchemal.ts
---
import { logPrismaSchemaWithPreamble } from "@graviola/json-schema-prisma-utils";
import { extendSchemaShortcut } from "@graviola/json-schema-utils";
import { schema, schemaName } from "./schema";

const extendedSchema = extendSchemaShortcut(schema);

console.log(logPrismaSchemaWithPreamble(schemaName, extendedSchema));
