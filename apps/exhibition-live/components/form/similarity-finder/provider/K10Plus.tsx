import { ClassicResultListItem } from "@graviola/edb-basic-components";
import type { RootNode } from "@graviola/edb-global-types";
import { findFirstInProps } from "@graviola/edb-graph-traversal";
import { findEntityWithinK10Plus } from "@graviola/edb-kxp-utils";
import { fabio } from "@graviola/edb-marc-to-rdf";
import { dcterms } from "@tpluscode/rdf-ns-builders";

import { Img } from "../../../basic";
import { KnowledgeBaseDescription } from "../types";
export const K10Plus: KnowledgeBaseDescription = {
  id: "k10plus",
  label: "K10plus",
  description: "K10plus",
  icon: (
    <Img
      alt={"gnd logo"}
      width={24}
      height={24}
      src={"Icons/k10plus-logo.png"}
    />
  ),
  find: async (searchString, typeIRI, typeName, findOptions) => {
    const test = await findEntityWithinK10Plus(
      searchString,
      typeName,
      "http://sru.k10plus.de/gvk",
      findOptions?.limit || 10,
      "marcxml",
    );
    return test || [];
  },
  listItemRenderer: (entry, idx, typeIRI, selected, onSelect, onAccept) => {
    const data = entry as RootNode;
    return (
      <ClassicResultListItem
        key={data.id}
        id={String(data.id)}
        index={idx}
        onSelected={(id, index) => onSelect(id, index)}
        label={
          data.properties[dcterms.title.value]?.[0]?.value || String(data.id)
        }
        secondary={findFirstInProps(
          data.properties,
          fabio.hasSubtitle,
          dcterms.description,
          dcterms.abstract,
        )}
        altAvatar={String(idx + 1)}
      />
    );
  },
};
