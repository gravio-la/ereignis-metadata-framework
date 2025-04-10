import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDataStore } from "./useDataStore";
import { filterUndefOrNull } from "@graviola/edb-core-utils";
import { useAdbContext } from "./provider";
import type { UseCRUDHook } from "./useCrudHook";
import { useCallback } from "react";
import type { NamedAndTypedEntity } from "@graviola/edb-core-types";
import { jsonld2DataSet, cleanJSONLD } from "@graviola/jsonld-utils";

type LoadResult = {
  subjects: string[];
  document: any;
};

const getAllSubjectsFromResult = (result: any) => {
  const ds = jsonld2DataSet(result);
  const subjects: Set<string> = new Set();
  // @ts-ignore
  for (const quad of ds) {
    if (quad.subject.termType === "NamedNode") {
      subjects.add(quad.subject.value);
    }
  }
  return Array.from(subjects);
};

const resultWithSubjects = (result: any) => {
  let subjects = [];
  try {
    subjects = getAllSubjectsFromResult(result);
  } catch (e) {}
  return {
    subjects,
    document: result,
  };
};
export const useCRUDWithQueryClient: UseCRUDHook<
  LoadResult,
  boolean,
  void,
  Record<string, any>
> = ({
  entityIRI,
  typeIRI,
  schema,
  queryOptions,
  loadQueryKey: presetLoadQueryKey,
  allowUnsafeSourceIRIs,
}) => {
  const { jsonLDConfig, createEntityIRI } = useAdbContext();
  const { dataStore, ready } = useDataStore();
  const loadQueryKey = presetLoadQueryKey || "load";
  const { defaultPrefix, jsonldContext } = jsonLDConfig;
  //const { resolveSourceIRIs } = useQueryKeyResolver();
  const { enabled, ...queryOptionsRest } = queryOptions || {};
  const queryClient = useQueryClient();

  const loadQuery = useQuery({
    queryKey: [loadQueryKey, entityIRI],
    queryFn: async () => {
      if (!entityIRI || !ready) return null;
      const typeName = dataStore.typeIRItoTypeName(typeIRI);
      const result = await dataStore.loadDocument(typeName, entityIRI);
      return resultWithSubjects(result);
    },
    enabled: Boolean(entityIRI && typeIRI && ready) && enabled,
    refetchOnWindowFocus: false,
    ...queryOptionsRest,
  });

  const removeMutation = useMutation({
    mutationKey: ["remove", entityIRI],
    mutationFn: async () => {
      if (!entityIRI || !ready) {
        throw new Error("entityIRI or updateFetch is not defined");
      }
      const typeName = dataStore.typeIRItoTypeName(typeIRI);
      return await dataStore.removeDocument(typeName, entityIRI);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["list"] });
      queryClient.invalidateQueries({
        queryKey: filterUndefOrNull(["allEntries", typeIRI || undefined]),
      });
    },
  });

  const saveMutation = useMutation({
    mutationKey: ["save", typeIRI, entityIRI || "create"],
    mutationFn: async (data: Record<string, any>) => {
      if (!Boolean(allowUnsafeSourceIRIs)) {
        if (!typeIRI || !ready)
          throw new Error(
            "typeIRI not defined",
          );
      }
      const typeName = dataStore.typeIRItoTypeName(typeIRI);
      const _entityIRI = entityIRI || createEntityIRI(typeName);
      const dataWithType: NamedAndTypedEntity = {
        ...data,
        "@id": _entityIRI,
        ...(typeIRI ? { "@type": typeIRI } : {}),
      } as NamedAndTypedEntity;
      const cleanData = await cleanJSONLD(dataWithType, schema, {
        jsonldContext,
        defaultPrefix,
        keepContext: true,
      });
      const result = await dataStore.upsertDocument(typeName, _entityIRI, cleanData);
      const { "@context": context, ...cleanDataWithoutContext } = result;
      return cleanDataWithoutContext;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [loadQueryKey, entityIRI] });
      await queryClient.invalidateQueries({ queryKey: ["show", entityIRI] });
    },
  });

  const existsQuery = useQuery({
    queryKey: ["exists", entityIRI],
    queryFn: async () => {
      if (!entityIRI || !typeIRI || !ready) return null;
      const typeName = dataStore.typeIRItoTypeName(typeIRI);
      return await dataStore.existsDocument(typeName, entityIRI);
    },
    enabled: Boolean(entityIRI && typeIRI && ready) && enabled,
    refetchOnWindowFocus: false,
    ...queryOptionsRest,
  });

  const loadEntity = useCallback(
    async (entityIRI: string, typeIRI: string) => {
      return queryClient.fetchQuery({
        queryKey: [loadQueryKey, typeIRI, entityIRI],
        queryFn: async () => {
          const typeName = dataStore.typeIRItoTypeName(typeIRI);
          const result = await dataStore.loadDocument(typeName, entityIRI);
          return resultWithSubjects(result);
        },
      });
    },
    [loadQueryKey, dataStore.loadDocument, queryClient],
  );

  return {
    loadEntity,
    loadQuery,
    existsQuery,
    removeMutation,
    saveMutation,
  };
};
