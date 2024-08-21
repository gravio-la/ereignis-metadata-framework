import { KnowledgeSources } from "@slub/edb-global-types";
import * as React from "react";

export type SelectedEntity = {
  id: string;
  source: KnowledgeSources;
};
export type FindOptions = {
  limit?: number;
  page?: number;
  offset?: number;
  pageSize?: number;
};
export type KnowledgeBaseDescription<T = any> = {
  id: KnowledgeSources;
  authorityIRI?: string;
  label: string;
  description: string;
  icon: string | React.ReactNode;
  find: (
    searchString: string,
    typeIRI: string,
    typeName: string,
    findOptions?: FindOptions,
  ) => Promise<T[]>;
  detailRenderer?: (id: string) => React.ReactNode;
  listItemRenderer?: (
    entry: any,
    idx: number,
    typeIRI: string,
    selected: boolean,
    onSelect?: (id: string, index: number) => void,
    onAccept?: (id: string, entry: any) => void,
  ) => React.ReactNode;
};
