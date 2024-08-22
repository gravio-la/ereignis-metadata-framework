import { BlankNode } from "@rdfjs/types";
import { findFirstInProps, NodePropertyTree } from "@slub/edb-graph-traversal";
import { useMemo } from "react";
import { dcterms, foaf, rdfs, skos } from "@tpluscode/rdf-ns-builders";
import { geonames, radatana } from "@slub/edb-marc-to-rdf";
import { LightTooltip } from "./LightTooltip";
import { Button } from "@mui/material";

import { KXPAllPropTable } from "./KXPAllPropTable";

export const LabeledBNode = ({
  bnode,
  properties,
}: {
  bnode: BlankNode;
  properties: NodePropertyTree;
}) => {
  const label = useMemo(
    () =>
      findFirstInProps(
        properties,
        foaf.name,
        dcterms.title,
        skos.prefLabel,
        rdfs.label,
        radatana.catalogueName,
        geonames("name"),
      ),
    [properties],
  );
  return (
    <LightTooltip
      title={
        <>
          <KXPAllPropTable entry={{ id: bnode.value, properties }} />
        </>
      }
    >
      <Button>{label || bnode.value}</Button>
    </LightTooltip>
  );
};
