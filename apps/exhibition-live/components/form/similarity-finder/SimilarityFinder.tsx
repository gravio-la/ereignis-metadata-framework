import { EntityFinder } from "@graviola/entity-finder";
import { EntityFinderProps } from "@graviola/semantic-jsonform-types";
import { FunctionComponent } from "react";

import { useKnowledgeBases } from "./useKnowledgeBases";

type SimilarityFinderProps = EntityFinderProps & {
  data: any;
};

export const SimilarityFinder: FunctionComponent<SimilarityFinderProps> = ({
  data,
  search,
  onSearchChange,
  classIRI,
  ...props
}) => {
  const allKnowledgeBases = useKnowledgeBases();

  return (
    <EntityFinder
      {...props}
      search={search}
      classIRI={classIRI}
      allKnowledgeBases={allKnowledgeBases}
    />
  );
};
