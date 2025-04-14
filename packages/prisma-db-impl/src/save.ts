import { PrismaClient } from "@prisma/client";
import { getPropertiesAndConnects } from "./helper";
import { StringToIRIFn } from "@graviola/edb-core-types";

export const save = async (
  typeNameOrigin: string,
  document: any,
  prisma: PrismaClient,
  importError: Set<string>,
  options: {
    idToIRI?: StringToIRIFn;
    typeNameToTypeIRI?: StringToIRIFn;
    typeIsNotIRI?: boolean;
  },
) => {
  const { id, properties, connects } = await getPropertiesAndConnects(
    typeNameOrigin,
    document,
    prisma,
    importError,
    "",
    options,
  );

  if (!id) {
    console.error("no id");
    return;
  }
  try {
    // Combine upsert and connect operations into a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // First create/update the main entity with all its properties
      const upsertResult = await tx[typeNameOrigin].upsert({
        where: {
          id,
        },
        create: {
          id,
          ...properties,
          // Include all connections in the create operation
          ...Object.fromEntries(
            Object.entries(connects).map(([key, connect]) => [
              key,
              {
                connect,
              },
            ]),
          ),
        },
        update: {
          ...properties,
          // Include all connections in the update operation
          ...Object.fromEntries(
            Object.entries(connects).map(([key, connect]) => [
              key,
              {
                connect,
              },
            ]),
          ),
        },
        include: Object.fromEntries(
          Object.keys(connects).map((key) => [key, true]),
        ),
      });

      return {
        upsertResult,
      };
    });

    return result;
  } catch (error) {
    console.error("could not save document", typeNameOrigin, id);
    console.error(JSON.stringify(connects, null, 2));
    console.error(error);

    throw error;
  }
};
