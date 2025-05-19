import { NodePropertyTree } from "@graviola/edb-global-types";
import type { NamedNode } from "@rdfjs/types";

/**
 * Find the first value of a property in a property tree.
 * @param props The property tree.
 * @param predicates The properties to search for.
 */
export const findFirstInProps = (
  props: NodePropertyTree,
  ...predicates: NamedNode[]
): string | undefined => {
  for (const predicate of predicates) {
    const value = props[predicate.value];
    if (value?.[0]) {
      return value[0].value;
    }
  }
  return undefined;
};
