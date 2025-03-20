import { FunctionComponent } from "react";
import { EntityFinder } from "@graviola/entity-finder";
import { useKnowledgeBases } from "./useKnowledgeBases";
import { SimilarityFinderProps } from "@graviola/semantic-jsonform-types";

export const SimilarityFinder: FunctionComponent<SimilarityFinderProps> = (
  props,
) => {
  const allKnowledgeBases = useKnowledgeBases();

  return <EntityFinder {...props} allKnowledgeBases={allKnowledgeBases} />;
};
